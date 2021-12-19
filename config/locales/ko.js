module.exports = {
  tHome: 'Home',
  tRelativePosts: '연관 글',
  tTags: 'Tags',
  tIndTitle: '전체 글',
  taIndKeywords: [`blog`, `gatsby`, `javascript`, `react`],
  tfIndCountPosts: ({ count, from, to }) => `${count} Posts (${from} - ${to})`,
  tfTagHeader: (totalCount, tag) =>
    `"${tag}" 태그가 붙은 post ${totalCount} ${totalCount === 1 ? '' : 's'}`,
  t404Title: '404 죄송함당..ㅜ',
  t404Content: '해당 포스트를 찾을 수 없습니다.',
};
