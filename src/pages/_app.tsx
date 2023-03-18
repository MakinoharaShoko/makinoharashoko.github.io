import '@/styles/globals.css'
import 'modern-css-reset/dist/reset.min.css'
import '../styles/blogPost.css'
import type {AppProps} from 'next/app'
import MainLayout from "@/layouts/MainLayout";
import {useEffect} from "react";
import vhCheck from "vh-check";

export default function App({Component, pageProps}: AppProps) {
  useEffect(()=>{
    vhCheck();
  },[])
  return <MainLayout>
    <Component {...pageProps} />
  </MainLayout>


}
