// pages/posts/[id].js

// Generates `/posts/1` and `/posts/2`
import {getAllPosts} from "@/pages/api/getPostsList";
import ReactMarkdown from 'react-markdown'
import {useMarkdown} from "@/hooks/useMarkdown";
import {getPostDetail} from "@/pages/api/getPost/[name]";
import s from './post.module.scss'
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {useTagsStore} from "@/store/tags";
import backIcon from '../../assets/back.png';
import closeIcon from '../../assets/close.png';
import Image from "next/image";
import hljs from 'highlight.js';
import "highlight.js/styles/github.css";
import 'katex/dist/katex.min.css';
import renderMathInElement from "katex/contrib/auto-render";
import remarkGfm from 'remark-gfm';
import {marked} from 'marked';
import remarkSlug from 'remark-slug';
import up from '../../assets/up.png';
import down from '../../assets/down.png'

export async function getStaticPaths() {
  const pages = await getAllPosts();
  const paths = pages.filter(page => page.extName.toLowerCase() === '.md' || page.extName.toLowerCase() === '.markdown')
    .map(page => ({
      params: {id: page.name}
    }))
  return {
    paths,
    fallback: false, // can also be true or 'blocking'
  }
}

// `getStaticPaths` requires using `getStaticProps`
export async function getStaticProps(context: any) {
  const fileName = context.params.id;
  const post = await getPostDetail(fileName)
  return {
    props: {
      post
    }
  }
}

export default function Post({post}: { post: string }) {
  const article = useMarkdown(post);
  const postAttr = article.attributes;
  const postBody = article.body;
  /**
   * TOC
   */
  const renderer = new marked.Renderer() as any;
  renderer.headings = [];
  renderer.heading = function (text: string, level: unknown, raw: unknown) {
    this.headings.push(text)
    return text;
  }
  marked(postBody, {renderer});
  const heading = renderer.headings as string[];
  const route = useRouter();
  const tags = useTagsStore();
  // @ts-ignore
  const title = postAttr?.title ?? '未命名'
  const path = route.asPath;
  const [isShowHeadings, setIsShowHeadings] = useState(false);

  function generate(title: string) {
    const nonChineseChars = /[^a-zA-Z0-9\u4e00-\u9fa5\s]+/g;
    const titleWithSlugifiedNonChineseChars = title.replace(nonChineseChars, (match) => {
      if (match === '-') {
        return '-';
      }
      return '';
    });

    // 将连续的空格替换为-
    return titleWithSlugifiedNonChineseChars.replace(/\s+/g, '-').toLowerCase();
  }

  const headingList = heading.map(e => {
    const title = e.replace(/<[^>]*>/g, '');
    return <div key={e} className={s.headingButton} onClick={() => {
      location.hash = encodeURI(generate(title));
      setIsShowHeadings(false)
    }}>
      {title}
    </div>
  })
  useEffect(() => {
    if (!tags.tags.find(e => e.url === path))
      tags.addTag({title, url: path})
    hljs.highlightAll();

    renderMathInElement(document.body, {
      delimiters: [
        {left: '$$', right: '$$', display: true},
        {left: '\\[', right: '\\]', display: true},
        {left: '$', right: '$', display: true},
        {left: '\\(', right: '\\)', display: true},
      ],
      throwOnError: false
    });
  }, [])


  const close = () => {
    // 关闭当前页，跳到主页
    route.replace('/').then();
    tags.deleteTag(path);
  }

  const back = () => {
    route.back();
  }

  const articleBody = <ReactMarkdown remarkPlugins={[remarkGfm, remarkSlug]}>{postBody}</ReactMarkdown>
  return <div className={s.post}>
    <div className={s.top}>
      <div className={s.b} onClick={back}>
        <Image className={s.bi} src={backIcon} alt={'back'}/>
      </div>
      <div className={s.tit} onClick={() => setIsShowHeadings(!isShowHeadings)}>
        {title}
        {headingList.length > 0 && <>
          {isShowHeadings && <Image className={s.iconSmall} src={up} alt={'close'}/>}
          {!isShowHeadings && <Image className={s.iconSmall} src={down} alt={'open'}/>}
        </>}
      </div>
      <div className={s.b} onClick={close}>
        <Image className={s.bi} src={closeIcon} alt={'close'}/>
      </div>
    </div>

    <div className={s.mdWarpper}>
      {isShowHeadings && headingList.length > 0 && <div className={s.menu}>
        {headingList}
      </div>}
      <div className={'markdown-body' + ' ' + s.md}>
        {articleBody}
      </div>
    </div>


  </div>
}
