// pages/posts/[id].js

// Generates `/posts/1` and `/posts/2`
import {IPostsDesc} from "@/pages/api/getPostsList";
import ReactMarkdown from 'react-markdown'
import fm from "front-matter";

export async function getStaticPaths() {
  const pages = await fetch('http://localhost:3000/api/getPostsList').then(result => result.json()) as IPostsDesc[];
  const paths = pages.filter(page => page.extName.toLowerCase() === '.md' || page.extName.toLowerCase() === '.markdown')
    .map(page => ({
      params: {id: page.name.split('.')[0]}
    }))
  return {
    paths,
    fallback: false, // can also be true or 'blocking'
  }
}

// `getStaticPaths` requires using `getStaticProps`
export async function getStaticProps(context: any) {
  const fileName = context.params.id;
  const post = await fetch(`http://localhost:3000/api/getPost/${fileName}.markdown`).then(res => res.text());
  return {
    props: {
      post
    }
  }
}

export default function Post({post}: { post: string }) {
  const postObj = fm(post);
  const postBody = postObj.body;
  const postAttr = postObj.attributes;
  console.log(postAttr);
  const articleBody = <ReactMarkdown>{postBody}</ReactMarkdown>
  return <div>
    {articleBody}
  </div>
}
