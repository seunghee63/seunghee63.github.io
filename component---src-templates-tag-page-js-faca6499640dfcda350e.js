(self.webpackChunkgatsby_simple_blog=self.webpackChunkgatsby_simple_blog||[]).push([[423],{3944:function(e,t,a){"use strict";a.d(t,{Z:function(){return u}});var n=a(7294),r=a(5444),l=a(5713),i=a(8415),s=a(5512),o=a(2999);function c(e){var t,a,c=e.slug,u=e.title,m=e.date,d=e.timeToRead,g=e.excerpt,p=e.tags,f=e.base;return g&&(t=n.createElement("p",{dangerouslySetInnerHTML:{__html:g}})),p&&(a=n.createElement(o.Z,{style:{margin:"0.5rem 0 -0.5rem -0.5rem"},tags:p,baseUrl:f+"tags"})),n.createElement("article",null,n.createElement("header",null,n.createElement("h3",{style:{fontFamily:"Montserrat, sans-serif",fontSize:(0,l.qZ)(1),marginBottom:(0,l.qZ)(1/4)}},n.createElement(r.Link,{style:{boxShadow:"none",color:"var(--textLink)"},to:c,rel:"bookmark"},u)),a,n.createElement("small",null,(0,s.p)(m)+" • "+(0,i.formatReadingTime)(d)),t))}c.defaultProps={title:null,excerpt:null,tags:null,base:""};var u=c},7775:function(e,t,a){"use strict";a.d(t,{Z:function(){return o}});var n=a(7294),r=a(5414),l=a(5444),i=a(2671);function s(e){var t=e.description,a=e.meta,s=e.keywords,o=e.title,c=(0,l.useStaticQuery)("1522010811").site,u=(0,i.Jr)().lang,m=t||c.siteMetadata.description;return n.createElement(r.q,{htmlAttributes:{lang:u||c.siteMetadata.lang},title:o,titleTemplate:"%s | "+c.siteMetadata.title,meta:[{name:"description",content:m},{property:"og:title",content:o},{property:"og:description",content:m},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary"},{name:"twitter:creator",content:c.siteMetadata.author},{name:"twitter:title",content:o},{name:"twitter:description",content:m}].concat(s.length>0?{name:"keywords",content:s.join(", ")}:[]).concat(a)})}s.defaultProps={meta:[],keywords:[],description:""};var o=s},2999:function(e,t,a){"use strict";a.d(t,{Z:function(){return o}});var n=a(9756),r=a(7294),l=a(8415),i=a(9348);function s(e){var t=e.tags,a=e.baseUrl,s=(0,n.Z)(e,["tags","baseUrl"]);return r.createElement("ul",Object.assign({className:"tag-ul"},s),t.map((function(e){return r.createElement("li",{key:e},r.createElement(i.Z,{text:e,url:a+"/"+(0,l.kebabCase)(e)}))})))}s.defaultProps={baseUrl:""};var o=s},2241:function(e,t,a){"use strict";a.r(t);var n=a(7294),r=a(5955),l=a(7775),i=a(3944),s=a(3914),o=a(2671),c=a(5512);t.default=function(e){var t=e.pageContext,a=e.data,u=e.location,m=t.tag,d=a.allMarkdownRemark,g=d.edges,p=d.totalCount,f=a.site.siteMetadata.title,b=(0,o.Jr)(),y=b.lang,E=b.homeLink,k=(0,c.w)("tfTagHeader",p,m);return n.createElement(r.Z,{location:u,title:f,breadcrumbs:[{text:(0,c.w)("tTags"),url:E+"tags"},{text:m}]},n.createElement(l.Z,{title:k,description:k}),n.createElement("h1",null,k),n.createElement("main",null,g.map((function(e){var t=e.node,a=t.frontmatter.title||t.fields.slug;return n.createElement(i.Z,{key:t.fields.slug,base:E,lang:y,slug:t.fields.slug,date:t.frontmatter.date,timeToRead:t.timeToRead,title:a})}))),n.createElement("div",{style:{marginTop:50}}),n.createElement("aside",null,n.createElement(s.Z,null)))}}}]);
//# sourceMappingURL=component---src-templates-tag-page-js-faca6499640dfcda350e.js.map