import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useConfig } from "@/lib/widget-config";
import { decodeHtml } from "@/lib/text";

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
  description?: string;
  url: { target: string };
  source?: { name?: string };
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

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["news", limit],
    queryFn: () => fetchArticles(limit),
  });

  return (
    <div className="h-full w-full flex flex-col" data-testid="news-widget">
      <header className="flex items-baseline justify-between px-4 py-2.5 border-b border-border">
        <span className="font-mono uppercase tracking-[0.3em] text-[10px] text-muted-foreground">
          Feed
        </span>
        <span className="font-mono tabular-nums text-[10px] text-muted-foreground/60">
          {isLoading ? "loading" : `${items.length.toString().padStart(3, "0")} items`}
        </span>
      </header>

      <ScrollArea className="no-drag flex-1">
        <ul className="divide-y divide-border">
          {items.map((item, i) => {
            const title = decodeHtml(item.title || "");
            const description = decodeHtml(item.description || "");
            const source = item.source?.name;
            return (
              <li key={item._id} className="group">
                <a
                  href={item.url.target}
                  target="_blank"
                  rel="noreferrer"
                  className="block px-4 py-3 transition-colors hover:bg-white/[0.02]"
                >
                  <div className="flex items-baseline gap-2 mb-1.5">
                    <span className="font-mono tabular-nums text-[10px] text-muted-foreground/50">
                      {(i + 1).toString().padStart(2, "0")}
                    </span>
                    {source && (
                      <span className="font-mono uppercase tracking-[0.2em] text-[10px] text-secondary/80 truncate">
                        {source}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-medium leading-snug text-foreground/95 group-hover:text-primary transition-colors">
                    {title}
                  </h3>
                  {description && (
                    <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                      {description}
                    </p>
                  )}
                </a>
              </li>
            );
          })}
          {!isLoading && items.length === 0 && (
            <li className="px-4 py-6 text-center text-xs text-muted-foreground">
              No articles.
            </li>
          )}
        </ul>
      </ScrollArea>
    </div>
  );
};

NewsWidget.defaultLayout = { w: 20, h: 8 };

export default NewsWidget;
