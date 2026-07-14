import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useConfig } from "@/lib/widget-config";

const feeds = [
  "5718e53d7a84fb1901e0591d",
  "5718e53d7a84fb1901e05914",
  "5718e53e7a84fb1901e059c7",
  "5718e53e7a84fb1901e05929",
  "5718e53e7a84fb1901e05971",
];

interface NewsItem {
  _id: string;
  title: string;
  description: string;
  url: { target: string };
}

const fetchArticles = async (limit: number): Promise<NewsItem[]> => {
  const response = await axios.get("https://api-panda.com/v4/articles", {
    params: { feeds: feeds.join(","), limit, page: 1, sort: "latest" },
  });
  return response.data;
};

export const NewsWidget = () => {
  const { limit } = useConfig({
    limit: { type: "number", default: 50, min: 1, max: 200, label: "Article limit" },
  } as const);

  const { data: items = [] } = useQuery({
    queryKey: ["news", limit],
    queryFn: () => fetchArticles(limit),
  });

  return (
    <ScrollArea className="no-drag">
      {items.map((item) => (
        <div key={item._id} className="mb-2">
          <a href={item.url.target} target="_blank" rel="noreferrer">
            <h3 className="text-lg font-bold">{item.title}</h3>
          </a>
          <p>{item.description}</p>
        </div>
      ))}
    </ScrollArea>
  );
};

NewsWidget.defaultLayout = { w: 20, h: 5 };

export default NewsWidget;
