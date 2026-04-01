import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import KnowMoreContent from "./know-more-content"
import AntibioticResistanceContent from "./antibiotic-resistance-content"
import ListOfAntibioticsContent from "./list-of-antibiotics-content"

export default function Education() {
  return (
    <div className="min-h-screen bg-background pt-24 p-8">
      <div className="max-w-6xl mx-auto">
        <Tabs defaultValue="know-more" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto">
            <TabsTrigger value="know-more" className="py-2">Know more</TabsTrigger>
            <TabsTrigger value="antibiotic-resistance" className="py-2">Antibiotic resistance</TabsTrigger>
            <TabsTrigger value="list-antibiotics" className="py-2">List of Antibiotics</TabsTrigger>
          </TabsList>
          {/* KNOW MORE TAB */}
          <TabsContent value="know-more" className="mt-6">
            <div className="p-6 border rounded-lg bg-card">
              <h2 className="text-2xl font-semibold mb-4">Know More</h2>
              <KnowMoreContent />
            </div>
          </TabsContent>

          <TabsContent value="antibiotic-resistance" className="mt-6">
            <div className="p-6 border rounded-lg bg-card">
              <h2 className="text-2xl font-semibold mb-4">Antibiotic Resistance</h2>
              <AntibioticResistanceContent />
            </div>
          </TabsContent>

          <TabsContent value="list-antibiotics" className="mt-6">
            <div className="p-6 border rounded-lg bg-card">
              <h2 className="text-2xl font-semibold mb-4">List of Antibiotics</h2>
              <ListOfAntibioticsContent />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
