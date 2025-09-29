import Bestseller from "@/sections/BestSelling";
import CategoriesGrid from "@/sections/Categories";
import PharmaFAQ from "@/sections/Faq";
import BannerSlider from "@/sections/Hero";
import WhyChooseUs from "@/sections/Whychooseus";


export default function Home() {
  return (
    <>
      <BannerSlider />
      <CategoriesGrid />
      <Bestseller />
      <WhyChooseUs/>
      <PharmaFAQ />
    </>
  );
}
