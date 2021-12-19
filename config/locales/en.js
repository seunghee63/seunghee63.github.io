module.exports = {
  tHome: 'Home',
  tRelativePosts: 'Relative posts',
  tTags: 'Tags',
  tIndTitle: 'All posts',
  taIndKeywords: [`blog`, `gatsby`, `javascript`, `react`],
  tfIndCountPosts: ({ count, from, to }) => `${count} Posts (${from} - ${to})`,
  tfTagHeader: (totalCount, tag) =>
    `${totalCount} post${totalCount === 1 ? '' : 's'} tagged with "${tag}"`,
  t404Title: 'Not Found',
  t404Content: "You just hit a route that doesn't exist... the sadness.",
};
