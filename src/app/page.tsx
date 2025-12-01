import Sidebar from "@/components/sidebar";
import Form from "./views/export/page";
import Login from "./views/login/page"
import SummaryView from "./views/summary/page";


export default function Home() {
  return (
    <section>
      <SummaryView />
      {/* <Login /> */}
      {/* <Form /> */}
    </section>
  );
}
