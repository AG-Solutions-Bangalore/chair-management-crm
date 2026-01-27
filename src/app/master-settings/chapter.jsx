import ChapterList from "@/components/master-settings/chapter-superadmin/chapter-list";
import DesignationList from "@/components/master-settings/designation/designation-list";
import FaqList from "@/components/master-settings/faq/faq-list";
import OtsList from "@/components/master-settings/ots/ots-list";
import StateList from "@/components/master-settings/state/state-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Chapter = () => {
  return (
    <div className="p-4 max-w-full mx-auto">
    

      <Tabs defaultValue="chapter" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-2">
          <TabsTrigger value="chapter">Chapter</TabsTrigger>
          <TabsTrigger value="state">State</TabsTrigger>
          <TabsTrigger value="designation">Designation</TabsTrigger>
          <TabsTrigger value="ots">Ots</TabsTrigger>
          <TabsTrigger value="faq">Faq</TabsTrigger>
        
        </TabsList>

        <TabsContent value="chapter" className="space-y-2">
        <ChapterList/>
        </TabsContent>

        <TabsContent value="state" className="space-y-2">
          <StateList/>
        </TabsContent>

        <TabsContent value="designation" className="space-y-2">

  <DesignationList/>
 

        </TabsContent>
        <TabsContent value="ots" className="space-y-2">

        <OtsList/>
       
 

        </TabsContent>
        <TabsContent value="faq" className="space-y-2">

        <FaqList/>
 

        </TabsContent>

       
      </Tabs>
    </div>
  );
};

export default Chapter;
