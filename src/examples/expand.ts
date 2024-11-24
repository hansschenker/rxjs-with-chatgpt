import { from, of } from 'rxjs';
import { expand, map, takeWhile, concatMap } from 'rxjs/operators';
import axios from 'axios';

/**
 * Function to fetch GitHub API data with pagination.
 * @param url The URL to make the GET request to.
 * @returns An Observable containing data and the next URL if available.
 */
function fetchGitHubRepos(url: string) {
  return from(axios.get(url)).pipe(
    map(response => {
      const nextUrl = parseLinkHeader(response.headers.link);
      return {
        data: response.data,
        nextUrl,
      };
    })
  );
}

/**
 * Helper function to parse the "link" header to get the next page URL.
 * @param linkHeader The link header string to parse.
 * @returns The next URL if available, otherwise null.
 */
function parseLinkHeader(linkHeader: string | undefined): string | null {
  if (!linkHeader) return null;
  const links = linkHeader.split(',').map(part => part.trim());
  const nextLink = links.find(link => link.includes('rel="next"'));
  if (nextLink) {
    const match = nextLink.match(/<([^>]+)>/);
    return match ? match[1] : null;
  }
  return null;
}

// Starting URL for GitHub API (e.g., repositories of a user)
const initialUrl = 'https://api.github.com/users/hansschenker/repos?per_page=10';

// Using expand for paginated fetching
fetchGitHubRepos(initialUrl)
  .pipe(
    expand(({ nextUrl }) => {
      // If next URL exists, continue fetching; otherwise, complete.
      return nextUrl ? fetchGitHubRepos(nextUrl) : of();
    }),
    takeWhile(({ nextUrl }) => nextUrl !== null, true), // Continue until there are no more pages
    concatMap(({ data }) => data) // Flatten data for each page
  )
  .subscribe({
    next: repo => console.log('Repo:', repo.name),
    complete: () => console.log('All pages retrieved'),
    error: err => console.error('Error:', err),
  });

/**
 * This script demonstrates how to use RxJS's expand operator to handle paginated data
 * from the GitHub API. It fetches repositories of a specific user and keeps fetching
 * until all pages are retrieved.
 */
