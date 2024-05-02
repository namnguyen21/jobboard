import { HTMLElement, parse } from "node-html-parser";
import fetch from "node-fetch";
import { prisma } from "@src/prisma-singleton";
import { logger as _logger } from "@src/logger-singleton";
import { Companies } from "@src/lib/constants";
import { Logger } from "winston";
import { Company } from "@prisma/client";

const baseUrl = "https://stripe.com";
const jobsUrl = `${baseUrl}/jobs/search?query=software+engineer`;

export async function stripe() {
  const logger = _logger.child({ service: "stripe" });
  logger.info("Starting stripe scraper");

  logger.info("Upserting Stripe company");
  const company = await prisma.company.upsert({
    where: {
      name: Companies.Stripe,
    },
    create: {
      name: Companies.Stripe,
    },
    update: {},
  });

  logger.profile(jobsUrl);
  const jobs = await fetch(jobsUrl);
  logger.profile(jobsUrl);

  const text = await jobs.text();
  let node = parse(text);

  let page = 1;
  while (true) {
    const tbody = node.querySelector("tbody.JobsListings__tableBody");
    if (!tbody) {
      logger.error("Could not find jobs table");
      throw new Error("Could not find jobs table");
    }

    await saveJobsFromTable(tbody, company, logger);

    const pagination = node.querySelector(".JobsPagination__list");
    if (!pagination) {
      logger.info("No pagination found, stopping");
      break;
    }

    const paginationLinks = pagination.querySelectorAll(
      ".JobsPagination__link"
    );
    const nextPageLink = paginationLinks.find(
      (button) => button.text === `${page + 1}`
    );
    if (!nextPageLink) {
      break;
    }

    const href = nextPageLink.getAttribute("href");
    if (!href || href[0] !== "?") {
      logger.error("Unexpected next page link format", {
        href,
        element: nextPageLink.toString(),
      });
      throw new Error("Unexpected next page link format");
    }

    const nextPageUrl = `${jobsUrl}${href.replace("?", "&")}`;

    logger.info(`Fetching next page: ${nextPageUrl}`);
    logger.profile(nextPageUrl);
    const res = await fetch(nextPageUrl);
    logger.profile(nextPageUrl);

    const text = await res.text();
    node = parse(text);

    if (!node) {
      logger.error("Could not parse next page");
      throw new Error("Could not parse next page");
    }

    page += 1;
  }

  logger.info("Stripe scraper finished");
}

async function saveJobsFromTable(
  tbody: HTMLElement,
  company: Company,
  logger: Logger
) {
  for (const tr of tbody.querySelectorAll("tr")) {
    const link = tr.querySelector("a.JobsListings__link");
    const locationSpan = tr.querySelector(
      "span.JobsListings__locationDisplayName"
    );
    const teamsItems = tr.querySelectorAll(
      "li.JobsListings__departmentsListItem"
    );

    if (!link || !locationSpan) {
      logger.error("Could not find job link or location");
      throw new Error("Could not find job link or location");
    }

    const href = link.getAttribute("href");
    const url = `${baseUrl}${href}`;
    const location = locationSpan.text;
    const teams = teamsItems.map((item) => item.text.replace(/^\s+|\s+$/g, ""));

    logger.info(`Upserting job post for ${url}`, {
      url,
      location,
      teams,
    });

    await prisma.jobPost.upsert({
      where: {
        url,
      },
      create: {
        url,
        companyId: company.id,
        locations: {
          create: {
            name: location,
          },
        },
        teams: {
          create: teams.map((name) => ({
            name,
          })),
        },
      },
      update: {
        locations: {
          deleteMany: {},
          create: {
            name: location,
          },
        },
        teams: {
          deleteMany: {},
          create: teams.map((name) => ({
            name,
          })),
        },
      },
    });
  }
}

stripe();
