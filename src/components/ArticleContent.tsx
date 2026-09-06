import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
export default function ArticleContent({ content }: { content: string }) {
  return <div className="article-content"><Markdown skipHtml remarkPlugins={[remarkGfm]} components={{ h1: ({ children }) => <h2>{children}</h2> }}>{content}</Markdown></div>;
}
