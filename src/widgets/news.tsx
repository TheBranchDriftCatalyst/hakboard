"use client";

import React, {useEffect, useState} from 'react';
import axios from 'axios';
// import {parseString} from 'xml2js'; // TODO remove this dependency
import {Card, CardContent} from "@/components/ui/card";
import WidgetWrapper from './widget-wrapper';

// interface NewsWidgetProps {
//   feed_bundle_url?: string;
// }

// NOTE: This is built to rip the RSS feeds from https://app.usepanda.com/#/
// You can find the unique ID of the feed source from the URL of the feed
const feeds = [
  "5718e53d7a84fb1901e0591d",
  "5718e53d7a84fb1901e05914",
  "5718e53e7a84fb1901e059c7",
  "5718e53e7a84fb1901e05929",
  "5718e53e7a84fb1901e05971"
]

const fetchArticlesFromFeed = async (feed_ids: string[], {limit = 50, page = 1, sort = 'latest'} = {}): Promise<NewsItem[]> => {
  try {
    console.log('Fetching RSS feed');
    const result = await axios.get('https://api-panda.com/v4/articles', {
      params: { feeds: feed_ids.join(','), limit, page, sort }
    });
    return result.data;
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    return []
  }
}

interface NewsItem {
  _id: string;
  source: Source;
  image: Image;
  flags: Flags;
  title: string;
  description: string;
  url: Urls;
  uniqueid: string;
}

interface Source {
  name: string;
  id: string;
  authorName: string;
  authorUrl: string;
  username: string;
  userId: string;
  sourceUrl: string;
  targetUrl: string;
  commentsCount: number;
  likesCount: number;
  createdAt: string;
  originalFeed: string;
  absoluteUrl: string;
  details: Record<string, unknown>; // Using Record for an object without a known shape
  subsources: unknown[]; // Replace `unknown` with a specific type if subsources structure is known
}

interface Image {
  small: string;
  normal: string;
  big: string;
  dimensions: Record<string, unknown>; // Assuming dimensions is an object with unknown structure
}

interface Flags {
  iframe: Iframe;
  promoted: boolean;
}

interface Iframe {
  checked: boolean;
  supported: boolean;
}

interface Urls {
  panda: string;
  social: string;
  target: string;
}

export const NewsWidget= () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const articles = fetchArticlesFromFeed(feeds).then((articles) => {
      console.log('Articles:', articles);
      setNewsItems(articles);
      setIsLoading(false);
    });
  }, []);

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  return (
      <CardContent>
        <div>
          {newsItems.map((item, index) => (
          <div key={index} className="mb-2">
            <a href={item.url.target} target="_blank" rel="noreferrer">
              <h3 className="text-lg font-bold">{item.title}</h3>
            </a>
            <p>{item.description}</p>
          </div>
        ))}
        </div>
      </CardContent>
  );
};

export default WidgetWrapper(NewsWidget, {});
