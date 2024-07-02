import Header from "@/app/components/header";
import ChatSection from "./components/chat-section";
import { Footer } from "./components/footer";

export default function Home() {
  return (
    <div className="bg-image-chat">
      <Header />
      <ChatSection />
      <Footer />
    </div>
  );
}
