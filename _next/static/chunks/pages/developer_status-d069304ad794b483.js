(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[288],{9936:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/developer_status",function(){return n(6531)}])},6531:function(e,t,n){"use strict";n.r(t),n.d(t,{DeveloperStatusView:function(){return o},default:function(){return l}});var r=n(5893),s=n(1163),i=n(7294),a=n(9747),u=n.n(a);function c(e){let[t,n]=(0,i.useState)(e),r=(0,i.useRef)(t);return{set v(newValue){r.current=newValue,n(newValue)},get v(){return r.current}}}function o(e){let t=c(""),n=c(""),s=c([]),a=c(0);async function o(){let r=await fetch("https://api.github.com/users/".concat(e.user)),i=await r.json(),u=i.public_repos,c=i.name,o=i.avatar_url,l=[],p=0,_=Math.ceil(u/100);for(let t=0;t<_;t++){let n=await fetch("https://api.github.com/users/".concat(e.user,"/repos?per_page=100&page=").concat(t)),r=await n.json();for(let e of r)if(!e.fork){let t=e.stargazers_count;p+=t,l.push(e)}}t.v=c,n.v=o,s.v=l,a.v=p}(0,i.useEffect)(()=>{o().then()},[e.user]);let l=s.v.sort((e,t)=>t.stargazers_count-e.stargazers_count).map(e=>{let t=e.description,n=e.html_url,s=e.name,i=e.stargazers_count;return(0,r.jsxs)("div",{className:u().repo,children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("a",{href:n,children:s}),(0,r.jsxs)("span",{children:[" ⭐ ",i]})]}),(0,r.jsx)("div",{children:t})]},s)});return(0,r.jsxs)("main",{className:u().main+" markdown-body",children:[(0,r.jsxs)("div",{className:u().info,children:[(0,r.jsx)("div",{children:(0,r.jsx)("img",{className:u().pic,src:n.v,alt:"avatar"})}),(0,r.jsxs)("div",{style:{padding:"20px"},children:[(0,r.jsx)("h3",{children:t.v}),(0,r.jsxs)("h4",{children:["⭐ ",a.v]})]})]}),(0,r.jsx)("div",{children:l})]})}function l(){let e=(0,s.useRouter)(),{user:t}=e.query;return(0,r.jsx)(o,{user:(null!=t?t:"").toString()})}},9747:function(e){e.exports={main:"developerStatus_main__lNqxi",info:"developerStatus_info__9jXGY",pic:"developerStatus_pic__nWi4k",repo:"developerStatus_repo__t_q2p"}}},function(e){e.O(0,[774,888,179],function(){return e(e.s=9936)}),_N_E=e.O()}]);