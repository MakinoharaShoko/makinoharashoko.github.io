// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import fsp from 'fs/promises'
import * as process from "process";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {name} = req.query;
  getPostDetail(name as string).then(result=>res.status(200).send(result))
}

async function getPostDetail(postname:string){
  console.log(postname)
  const postPath = path.join(process.cwd(),`posts/article/${postname}`);
  const postDetail = await fsp.readFile(postPath);
  return postDetail.toString('utf-8')
}
