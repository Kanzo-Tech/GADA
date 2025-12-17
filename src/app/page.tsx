import Sidebar from "@/components/sidebar";
import Form from "./(app)/export/page";
import Login from "./[locale]/(auth)/login/page"
import SummaryView from "./(app)/summary/page";


export default function Home() {
  return (
    <section>
      {/* <SummaryView /> */}
      <Login />
      {/* <Form /> */}
    </section>
  );
}
