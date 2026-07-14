import { useNavigate } from "react-router-dom";
import Navbar from "@/components/ui/navbar";
import { Counter } from "@/components/counter";
import { FeatureCard } from "@/components/ui/featureCard";
import {
  ArrowRight,
  Brain,
  Building,
  CheckCircle,
  Code,
  FolderOpen,
  Github,
  GraduationCap,
  Heart,
  Linkedin,
  MessageCircle,
  Play,
  Presentation,
  Rocket,
  Search,
  Sparkles,
  Star,
  Twitter,
  UserPlus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const featureData = [
  {
    title: "AI-Powered Matching",
    description: "Our intelligent algorithm analyzes skills, projects, and preferences to connect the right students with the right opportunities automatically.",
    icon: Brain,
  },
  {
    title: "Project Showcases",
    description: "Students can showcase their graduation projects with rich media, documentation, and live demos — making their work stand out to recruiters.",
    icon: Presentation,
  },
  {
    title: "Direct HR Chat",
    description: "Skip the middleman. Students and recruiters can communicate directly through our built-in messaging system for faster hiring decisions.",
    icon: MessageCircle,
  },
];

export default function App() {
  const navigate = useNavigate();
  return (
    <div>
      <div
        className="bg-white text-zinc-950 w-full h-fit h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible"
        data-id="b2be6dc6-5bd5-51fd-a20e-b737f641261c"
      >
        <Navbar />
        <section
          className="relative w-full overflow-hidden"
          data-id="1b6fa3a1-8bca-538c-87a4-e9873e1d8b8c"
        >
          <div
            className="z-0 absolute inset-0"
            data-id="cd371062-54ea-5550-bc42-70e9258bc4f7"
          >
            <img
              alt="Group of students is using laptop sitting in classroom and talking"
              className="object-cover w-full h-full"
              data-authorname="Vitaly Gariev"
              data-authorurl="https://unsplash.com/@silverkblack"
              data-blurhash="LFF#q6#5XT-90Kkrt6tS]}yDM_M_"
              data-photoid="EA0-iajPYFE"
              src="https://images.unsplash.com/photo-1758270705172-07b53627dfcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwY29sbGVnZSUyMHN0dWRlbnRzJTIwdGVjaG5vbG9neSUyMGxhcHRvcHxlbnwxfDB8fHwxNzc2NDY4NDE4fDA&ixlib=rb-4.1.0&q=80&w=1200"
              data-id="48bdce1c-3ffd-511e-9246-16996b076c0f"
            />
            <div
              className="bg-gradient-to-r from-background via-background/95 to-background/60 absolute inset-0"
              data-id="8222448f-9d05-5e20-a36a-a8a26696a720"
            />
          </div>
          <div
            className="relative z-10 max-w-[1140px] mx-auto px-8 py-24"
            data-id="afacba0f-c3fb-5897-bf54-4c2570a36a7c"
          >
            <div
              className="max-w-[600px] flex flex-col gap-6"
              data-id="47150a5a-690f-5652-a2a4-b77662d10ead"
            >
              <div
                className="flex items-center gap-2"
                data-id="84ed3858-5499-5225-9259-2269b35b7000"
              >
                <span
                  className="inline-flex font-semibold rounded-full bg-[#f0b100]/10 text-[#f0b100] text-xs leading-4 px-4 py-1.5 items-center gap-1"
                  data-id="e4fada91-3044-5a26-9da1-604fc055e3bd"
                >
                  <Sparkles
                    className="size-3"
                    data-id="7f8fa40d-5f97-5472-a527-e5d3ba039b01"
                  />
                  Launching 2025 — Join the Waitlist
                </span>
              </div>
              <h1
                className="leading-tight font-extrabold text-zinc-950 text-5xl leading-12 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-1000"
                data-id="75fa3079-f024-5af7-9c3d-4ab5f02491f7"
              >
                Bridging the Gap Between
                <span
                  className="text-[#f0b100]"
                  data-id="b10b097e-df36-5385-b7fe-92b888ce5d6a"
                >
                  Graduation
                </span>
                and
                <span
                  className="text-[#f0b100]"
                  data-id="19351096-d91d-5fa2-9979-20a2deb21c91"
                >
                  Recruitment
                </span>
              </h1>
              <p
                className="leading-relaxed text-[#71717b] text-lg leading-7"
                data-id="17411572-b842-546a-9337-36640fc5f4e0"
              >{`GradHub connects talented CS & IT graduates with top recruiters through AI-powered matching, project showcases, and direct communication.`}</p>
              <div
                className="flex pt-2 items-center gap-4"
                data-id="2806308e-a601-510d-85b6-7759dbab21c0"
              >
                <Button
                  onClick={() => navigate("/signup")}
                  className="shadow-lg font-semibold rounded-xl bg-[#f0b100] text-white text-base leading-6 px-8 py-6 cursor-pointer transition-all hover:scale-105 hover:bg-[#d69e00]"
                  data-id="af5493cf-09dd-5ce5-9fd4-f47c4f862008"
                >
                  <UserPlus
                    className="size-5 mr-2"
                    data-id="edf3b07d-df8c-553e-929c-aac569cb932d"
                  />
                  Create Student Profile
                </Button>
                <Button
                  onClick={() => navigate("/login")}
                  className="font-semibold rounded-xl text-[#f0b100] text-base leading-6 border-[#f0b100] border-2 border-solid px-8 py-6 cursor-pointer transition-all hover:scale-105 hover:bg-[#d69e00]"
                  variant="outline"
                  data-id="bfe2ebdd-fc9b-5db8-8d3a-e67df1271d37"
                >
                  <Search
                    className="size-5 mr-2"
                    data-id="261b2f9b-0719-54ce-95dd-536757802179"
                  />
                  Find Talent
                </Button>
              </div>
              {/* Footer statistics... */}
              <div
                className="flex pt-4 items-center gap-6"
                data-id="17faf7dd-7eb2-521e-a035-6d2efec8e7a7"
              >
                <div
                  className="text-[#71717b] text-sm leading-5 flex items-center gap-2"
                  data-id="13a71422-89cd-5aad-951f-8640c31e29e1"
                >
                  <CheckCircle className="size-4 text-[#f0b100]" data-id="4ce65974-d47d-5cda-8aaf-eedb727ef2e1" />
                  <span data-id="00f3e2bd-5901-5768-aa56-c754cb4ebc2c">5,000+ Students</span>
                </div>
                <div
                  className="text-[#71717b] text-sm leading-5 flex items-center gap-2"
                  data-id="c29ba591-fc41-5f9d-bd9e-2718b82f7aaf"
                >
                  <CheckCircle className="size-4 text-[#f0b100]" data-id="9a63fc3c-f219-5823-96b6-7c0a4820ccea" />
                  <span data-id="34252923-b788-5c18-94f3-ea33a3c3dc55">300+ Companies</span>
                </div>
                <div
                  className="text-[#71717b] text-sm leading-5 flex items-center gap-2"
                  data-id="a8606780-e0c2-583b-95af-f42bb72fd5c8"
                >
                  <CheckCircle className="size-4 text-[#f0b100]" data-id="d9da3e23-e7cd-5b05-93b5-ba4db65718a4" />
                  <span data-id="29221b6d-567b-5913-ad6a-ecbe0ec8709d">1,200+ Matches</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          className="border-y bg-zinc-100/50 border-zinc-200 border-0 border-solid w-full"
          data-id="9fdad8c8-3b0b-5893-905d-3f68640e08d2"
        >
          <div
            className="max-w-[1140px] mx-auto p-8"
            data-id="b561759e-b985-5187-adec-6d201d9544ad"
          >
            <Card
              className="shadow-lg rounded-2xl bg-white border-black/1 border-0 border-solid p-6 gap-4 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              data-id="5d676dad-bedd-5d74-8590-45f1497f9d85"
            >
              <CardContent
                className="p-0 gap-4"
                data-id="03643ddb-fb14-5711-82bf-fea64dcb65d5"
              >
                <div
                  className="flex mb-2 items-center gap-2"
                  data-id="53d66c7f-63ae-5379-aac3-312a71c08940"
                >
                  <Search
                    className="size-5 text-[#f0b100]"
                    data-id="89e19f28-a767-5833-a55b-e89e48f2dda9"
                  />
                  <span
                    className="font-semibold text-zinc-950 text-base leading-6"
                    data-id="f32392ce-4406-5771-b682-87d4207f037a"
                  >
                    Quick Talent Search
                  </span>
                </div>
                <div
                  className="flex items-center gap-4"
                  data-id="934954fe-79f5-56e5-912d-c3e2b75cc097"
                >
                  <div className="relative flex-1" data-id="5a6df3a9-b4bf-50c3-b9d9-ebdb70ae2eaa">
                    <Code className="top-1/2 -translate-y-1/2 size-4 text-[#71717b] absolute left-3" />
                    <Input
                      className="rounded-xl bg-zinc-100/50 text-sm leading-5 border-zinc-200 border-0 border-solid pl-10 h-12 focus:ring-2 focus:ring-[#f0b100] transition-all"
                      placeholder="Skills (e.g. React, Python, ML)"
                    />
                  </div>
                  <div className="relative flex-1" data-id="0ff43554-ff03-5c13-91b7-0528dde193b2">
                    <FolderOpen className="top-1/2 -translate-y-1/2 size-4 text-[#71717b] absolute left-3" />
                    <Input
                      className="rounded-xl bg-zinc-100/50 text-sm leading-5 border-zinc-200 border-0 border-solid pl-10 h-12 focus:ring-2 focus:ring-[#f0b100] transition-all"
                      placeholder="Graduation Project"
                    />
                  </div>
                  <div className="relative flex-1" data-id="b036c1a4-0f43-5a12-8b4c-c85da4f8d541">
                    <Building className="top-1/2 -translate-y-1/2 size-4 text-[#71717b] absolute left-3" />
                    <Input
                      className="rounded-xl bg-zinc-100/50 text-sm leading-5 border-zinc-200 border-0 border-solid pl-10 h-12 focus:ring-2 focus:ring-[#f0b100] transition-all"
                      placeholder="University"
                    />
                  </div>
                  <Button
                    className="shadow-md font-semibold rounded-xl bg-[#f0b100] text-white px-8 h-12 transition-all hover:bg-[#d69e00] cursor-pointer"
                    data-id="25a47259-8002-5e8b-b4b0-9baf76866e1b"
                  >
                    <Search className="size-4 mr-2" />
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        <section
          className="w-full"
          data-id="4d3f8daa-1710-5bf9-8ceb-3772c5d58c28"
        >
          <div
            className="max-w-[1140px] mx-auto px-8 py-20"
            data-id="92a02eb2-da57-588b-a609-f975c2882d1a"
          >
            <div
              className="text-center flex mb-12 flex-col items-center gap-4"
              data-id="63946238-83e4-5cb7-8633-822c02217de7"
            >
              <span
                className="inline-flex font-semibold rounded-full bg-[#f0b100]/10 text-[#f0b100] text-xs leading-4 px-4 py-1.5 items-center gap-1"
                data-id="0fef084e-dcb0-58d7-8dc7-fe08d44fbeb4"
              >
                Why GradHub?
              </span>
              <h2
                className="font-bold text-zinc-950 text-3xl leading-9 tracking-tight"
                data-id="8d6cc54a-b551-5132-ae07-d185d67c704f"
              >{`Powerful Features for Students & Recruiters`}</h2>
              <p
                className="max-w-[520px] text-[#71717b] text-base leading-6"
                data-id="28a64933-3bf6-5f0f-930f-ce76562c3a4a"
              >
                Everything you need to connect, showcase, and hire — all in one
                platform.
              </p>
            </div>
            {/* Grid Section */}
            <div className="w-full" data-id="3a71aeff-582b-5b4a-a0f3-c9d0775c2efb">
              {/* Removed the double-nesting grid. Only one grid is needed. */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start w-full">
                {featureData.map((feature, index) => (
                  <FeatureCard
                    key={index}
                    title={feature.title}
                    description={feature.description}
                    icon={feature.icon}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
        <section
          className="bg-zinc-100/30 w-full"
          data-id="646a04fa-b442-556a-a4d1-967ff6ba690e"
        >
          <div
            className="max-w-[1140px] mx-auto px-8 py-20"
            data-id="fb918e34-d083-5679-abd2-e553a684afdd"
          >
            <div
              className="flex mb-12 justify-between items-end"
              data-id="cf00b3c5-f249-5915-879d-ee1d1736562e"
            >
              <div
                className="flex flex-col gap-4"
                data-id="e0983bef-bb42-570f-bc89-66a94aaaec8a"
              >
                <span
                  className="inline-flex font-semibold rounded-full bg-[#f0b100]/10 text-[#f0b100] text-xs leading-4 px-4 py-1.5 items-center gap-1 w-fit"
                  data-id="57d05e0f-8f54-5900-a3fe-da5ad81305c6"
                >
                  <Star
                    className="size-3"
                    data-id="9c3d1498-80ef-5cec-91f2-505a78873028"
                  />
                  Featured Work
                </span>
                <h2
                  className="font-bold text-zinc-950 text-3xl leading-9 tracking-tight"
                  data-id="e220bbca-ca48-50a0-a112-687d5095c675"
                >
                  Featured Graduation Projects
                </h2>
                <p
                  className="max-w-[480px] text-[#71717b] text-base leading-6"
                  data-id="4b160bb1-92c2-5365-9587-13cebf42e204"
                >
                  Discover outstanding projects from talented graduates ready to
                  make an impact.
                </p>
              </div>
              <Button
                className="font-medium rounded-xl text-sm leading-5 cursor-pointer border-zinc-200 border-0 border-solid"
                variant="outline"
                data-id="82366893-2ed9-5d0f-bca8-475ad4a0ba88"
              >
                View All Projects
                <ArrowRight
                  className="size-4 ml-2"
                  data-id="6242a75f-9b0e-5652-928c-c2cb5e9a3572"
                />
              </Button>
            </div>
            <div
              className="grid grid-cols-4 gap-6"
              data-id="4d0fc0a2-8a8a-5410-b7a0-72d2cb6d586a"
            >
              {/* Card 1 */}
              <a href="#" className="group block">
                <Card className="transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl rounded-2xl border-zinc-200 border-1 border-solid p-0 gap-0 overflow-hidden" data-id="1e539a1d-d749-5419-96ea-8a3bfecfb855">
                  <div className="relative h-40 overflow-hidden" data-id="402a2efe-efb9-52cb-af97-5ae185692be7">
                    <img alt="Smart city IoT project" className="object-cover transition-transform duration-500 group-hover:scale-110 w-full h-full" src="https://images.unsplash.com/photo-1760553120324-d3d2bf53852b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGNpdHklMjBJb1QlMjBwcm9qZWN0JTIwdGVjaG5vbG9neXxlbnwxfDB8fHwxNzc2NDY4NDE4fDA&ixlib=rb-4.1.0&q=80&w=400" />
                    <div className="absolute right-2 top-2"><Badge className="font-medium rounded-lg bg-[#f0b100] text-white text-xs leading-4">IoT</Badge></div>
                  </div>
                  <div className="flex p-4 flex-col gap-2">
                    <h3 className="leading-snug font-bold text-zinc-950 text-sm">Smart Campus IoT System</h3>
                    <p className="line-clamp-2 text-[#71717b] text-xs leading-4">An IoT-based monitoring system for campus energy management and environmental tracking.</p>
                  </div>
                </Card>
              </a>

              {/* Card 2 */}
              <a href="#" className="group block">
                <Card className="transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl rounded-2xl border-zinc-200 border-1 border-solid p-0 gap-0 overflow-hidden" data-id="a804ea31-9667-5f19-82a8-d6dc7715c537">
                  <div className="relative h-40 overflow-hidden" data-id="28eb423a-b061-594d-8ffe-d52625bee74c">
                    <img alt="Mobile app interface design" className="object-cover transition-transform duration-500 group-hover:scale-110 w-full h-full" src="https://images.unsplash.com/photo-1767449181027-dbca7575f91b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBpbnRlcmZhY2UlMjBkZXNpZ24lMjBwcm9qZWN0fGVufDF8MHx8fDE3NzY0Njg0MTh8MA&ixlib=rb-4.1.0&q=80&w=400" />
                    <div className="absolute right-2 top-2"><Badge className="font-medium rounded-lg bg-[#f0b100] text-white text-xs leading-4">Mobile</Badge></div>
                  </div>
                  <div className="flex p-4 flex-col gap-2">
                    <h3 className="leading-snug font-bold text-zinc-950 text-sm">HealthTrack Mobile App</h3>
                    <p className="line-clamp-2 text-[#71717b] text-xs leading-4">A cross-platform health monitoring app with real-time vitals tracking and AI diagnostics.</p>
                  </div>
                </Card>
              </a>

              {/* Card 3 */}
              <a href="#" className="group block">
                <Card className="transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl rounded-2xl border-zinc-200 border-1 border-solid p-0 gap-0 overflow-hidden" data-id="25381489-3e35-52f8-a699-dd955ec33043">
                  <div className="relative h-40 overflow-hidden" data-id="c4956936-8aaa-5eb9-a8fa-e539fb0fbd1b">
                    <img alt="AI data visualization" className="object-cover transition-transform duration-500 group-hover:scale-110 w-full h-full" src="https://images.unsplash.com/photo-1761223976379-04c361d3068a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxtYWNoaW5lJTIwbGVhcm5pbmclMjBBSSUyMGRhdGElMjB2aXN1YWxpemF0aW9ufGVufDF8MHx8fDE3NzY0Njg0MTl8MA&ixlib=rb-4.1.0&q=80&w=400" />
                    <div className="absolute right-2 top-2"><Badge className="font-medium rounded-lg bg-[#f0b100] text-white text-xs leading-4">AI/ML</Badge></div>
                  </div>
                  <div className="flex p-4 flex-col gap-2">
                    <h3 className="leading-snug font-bold text-zinc-950 text-sm">NLP Sentiment Analyzer</h3>
                    <p className="line-clamp-2 text-[#71717b] text-xs leading-4">Deep learning model for real-time sentiment analysis of social media posts with 94% accuracy.</p>
                  </div>
                </Card>
              </a>

              {/* Card 4 */}
              <a href="#" className="group block">
                <Card className="transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl rounded-2xl border-zinc-200 border-1 border-solid p-0 gap-0 overflow-hidden" data-id="a906dd72-8cdd-5962-b82d-93d9648adeff">
                  <div className="relative h-40 overflow-hidden" data-id="87a408b6-a0a7-5799-81b1-d8a7271d95f1">
                    <img alt="Web development coding screen" className="object-cover transition-transform duration-500 group-hover:scale-110 w-full h-full" src="https://images.unsplash.com/photo-1637937459053-c788742455be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXZlbG9wbWVudCUyMGNvZGluZyUyMHNjcmVlbnxlbnwxfDB8fHwxNzc2NDY4NDI0fDA&ixlib=rb-4.1.0&q=80&w=400" />
                    <div className="absolute right-2 top-2"><Badge className="font-medium rounded-lg bg-[#f0b100] text-white text-xs leading-4">Web</Badge></div>
                  </div>
                  <div className="flex p-4 flex-col gap-2">
                    <h3 className="leading-snug font-bold text-zinc-950 text-sm">EduCollab Platform</h3>
                    <p className="line-clamp-2 text-[#71717b] text-xs leading-4">A collaborative learning platform with real-time code editing, video calls, and project management.</p>
                  </div>
                </Card>
              </a>
            </div>
          </div>
        </section>
        <section className="w-full" data-id="9e2e73da-2eb3-5e5b-9605-b3f0c5ac5e5c">
          <div className="max-w-[1140px] mx-auto px-8 py-20" data-id="f2491d55-368d-5b76-bc0b-65978b9926c0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              {/* Stat 1: 92% (Starts immediately) */}
              <div className="text-center flex p-6 flex-col items-center gap-2">
                {/* ... icon ... */}
                <span className="font-extrabold text-zinc-950 text-3xl leading-9">
                  <Counter value={92} suffix="%" delay={0} />
                </span>
                <span className="text-[#71717b] text-sm leading-5">Placement Rate</span>
              </div>

              {/* Stat 2: 300+ (Starts after 2 seconds) */}
              <div className="text-center flex p-6 flex-col items-center gap-2">
                {/* ... icon ... */}
                <span className="font-extrabold text-zinc-950 text-3xl leading-9">
                  <Counter value={300} suffix="+" delay={2} />
                </span>
                <span className="text-[#71717b] text-sm leading-5">Partner Companies</span>
              </div>

              {/* Stat 3: 50+ (Starts after 4 seconds) */}
              <div className="text-center flex p-6 flex-col items-center gap-2">
                {/* ... icon ... */}
                <span className="font-extrabold text-zinc-950 text-3xl leading-9">
                  <Counter value={50} suffix="+" delay={4} />
                </span>
                <span className="text-[#71717b] text-sm leading-5">Universities Connected</span>
              </div>

            </div>
          </div>
        </section>
        <section
          className="bg-zinc-950 w-full"
          data-id="279a25d9-7934-588e-bd30-81bf0b149dea"
        >
          <div
            className="max-w-[1140px] mx-auto px-8 py-20"
            data-id="090024a3-b566-55a6-b325-ed10aae83759"
          >
            <div
              className="text-center flex flex-col items-center gap-6"
              data-id="3fd91437-4cf1-54f2-9793-413e8fe2c8f9"
            >
              <h2
                className="font-bold text-white text-3xl leading-9 tracking-tight"
                data-id="b4ce5f8e-7c2a-5451-ac01-b71f6db5a7e0"
              >
                Ready to Launch Your Career?
              </h2>
              <p
                className="max-w-[480px] text-white/60 text-base leading-6"
                data-id="a5e70250-cb45-5c78-9800-9d298317e19b"
              >
                Join thousands of graduates and recruiters already using GradHub
                to build meaningful connections.
              </p>
              <div
                className="flex pt-2 items-center gap-4"
                data-id="3d564d99-08cd-5ecc-b39d-bcef18512a66"
              >
                <Button
                  onClick={() => navigate("/signup")}
                  className="shadow-lg font-semibold rounded-xl bg-[#f0b100] text-white text-base leading-6 px-8 py-6 cursor-pointer transition-all hover:scale-105 hover:bg-[#d69e00]"
                  data-id="a5bab9b2-e51e-5fa8-b5a6-04583059b0ef"
                >
                  <Rocket
                    className="size-5 mr-2"
                    data-id="40d2fa31-dd32-5bcc-a55e-e3950daf198a"
                  />
                  Get Started For Free
                </Button>
                <Button
                  variant="ghost"
                  className="font-semibold rounded-xl text-white/80 text-base leading-6 px-8 py-6 cursor-pointer transition-all hover:scale-105 hover:bg-white/10 hover:text-white"
                  data-id="9a6ffd60-da91-5beb-a711-9622842ae832"
                >
                  <Play
                    className="size-5 mr-2"
                    data-id="2eb84d3f-0063-5f87-8980-04af0d4d93b4"
                  />
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>
        </section>
        <footer
          className="border-zinc-200 border-t-1 border-r-0 border-b-0 border-l-0 border-solid w-full"
          data-id="18355b99-deb2-5f08-bfbd-05109d48daed"
        >
          <div
            className="max-w-[1140px] mx-auto px-8 py-12"
            data-id="7c9b2424-c81e-5587-be89-d02877a94a38"
          >
            <div
              className="grid grid-cols-4 gap-8"
              data-id="fb665a2b-f27b-5cc9-aa50-d58073a9e786"
            >
              <div
                className="flex flex-col gap-4"
                data-id="cbfa1874-9705-5e8c-bff0-5e7c8fcf7ca7"
              >
                <div
                  className="flex items-center gap-2"
                  data-id="791e867d-356b-545f-9a12-f94e5af61815"
                >
                  <div
                    className="rounded-lg bg-[#f0b100] flex justify-center items-center w-8 h-8"
                    data-id="4ecca76e-24fb-51ab-b5dd-e80fd96de537"
                  >
                    <GraduationCap
                      className="size-4 text-white"
                      data-id="078ce42a-8ed7-5730-bb2c-19c013044c1a"
                    />
                  </div>
                  <span
                    className="font-bold text-zinc-950 text-lg leading-7"
                    data-id="d7ff7eda-2d51-5895-9b11-41a0f535ab37"
                  >
                    GradHub
                  </span>
                </div>
                <p
                  className="leading-relaxed text-[#71717b] text-sm leading-5"
                  data-id="78ef754f-8e7f-5764-81ea-2a6eea9fdecf"
                >
                  Connecting talented graduates with leading companies
                  worldwide.
                </p>
                <div
                  className="flex pt-2 items-center gap-4"
                  data-id="16b5c877-e9f5-5002-b5af-7baa475d5228"
                >
                  <Twitter
                    className="size-4 cursor-pointer text-[#71717b]"
                    data-id="57d78c30-8704-5889-bad3-0adec4f8822b"
                  />
                  <Linkedin
                    className="size-4 cursor-pointer text-[#71717b]"
                    data-id="eacb96de-7a43-5aaf-bb16-7f0b984d598a"
                  />
                  <Github
                    className="size-4 cursor-pointer text-[#71717b]"
                    data-id="5e9cf8a8-a8eb-550e-9674-96494f44b1fe"
                  />
                </div>
              </div>
              <div
                className="flex flex-col gap-4"
                data-id="2d8aa83e-1ff7-51e5-ac2f-7f55f2cbf655"
              >
                <span
                  className="font-semibold text-zinc-950 text-sm leading-5"
                  data-id="530bf27a-cea5-5bbf-936b-4e191f01f1c4"
                >
                  For Students
                </span>
                <div
                  className="flex flex-col gap-2"
                  data-id="08562f9e-809f-595c-8e12-9a19b51839c8"
                >
                  <a
                    className="cursor-pointer text-[#71717b] text-sm leading-5"
                    data-id="120a9240-8d82-50bc-95d9-ad3f75c0d858"
                  >
                    Create Profile
                  </a>
                  <a
                    className="cursor-pointer text-[#71717b] text-sm leading-5"
                    data-id="ff65053d-b953-5920-bcbf-26c8b5898c13"
                  >
                    Browse Jobs
                  </a>
                  <a
                    className="cursor-pointer text-[#71717b] text-sm leading-5"
                    data-id="bf8c2f5e-fcfc-5bae-b167-54c29da21649"
                  >
                    Upload Project
                  </a>
                  <a
                    className="cursor-pointer text-[#71717b] text-sm leading-5"
                    data-id="38501194-e3e1-5a98-a9e8-82f3a174af82"
                  >
                    Resources
                  </a>
                </div>
              </div>
              <div
                className="flex flex-col gap-4"
                data-id="1689fd00-3780-50ce-a593-621bb751c4d9"
              >
                <span
                  className="font-semibold text-zinc-950 text-sm leading-5"
                  data-id="857545da-0e64-5686-95a4-97a25f8ed810"
                >
                  For Recruiters
                </span>
                <div
                  className="flex flex-col gap-2"
                  data-id="28af60a1-08e4-5e8a-b6be-113cc2d70103"
                >
                  <a
                    className="cursor-pointer text-[#71717b] text-sm leading-5"
                    data-id="85ab765f-d04c-5c3b-8c9f-7e1116bdc5c9"
                  >
                    Find Talent
                  </a>
                  <a
                    className="cursor-pointer text-[#71717b] text-sm leading-5"
                    data-id="4f08d2b8-a354-567c-ae51-580afd5adb91"
                  >
                    Post a Job
                  </a>
                  <a
                    className="cursor-pointer text-[#71717b] text-sm leading-5"
                    data-id="9f742539-63ba-50f9-add9-effeac0d2485"
                  >
                    Pricing
                  </a>
                  <a
                    className="cursor-pointer text-[#71717b] text-sm leading-5"
                    data-id="0e395bbd-8013-5b81-8323-9588f77fb3cf"
                  >
                    Enterprise
                  </a>
                </div>
              </div>
              <div
                className="flex flex-col gap-4"
                data-id="e613fb17-2964-5d14-a2f8-891dff5273c8"
              >
                <span
                  className="font-semibold text-zinc-950 text-sm leading-5"
                  data-id="a42e185d-7bd3-5152-a4b1-c35eeb7716f6"
                >
                  Company
                </span>
                <div
                  className="flex flex-col gap-2"
                  data-id="bda85b2e-8f0c-5853-97a4-73c896bc1184"
                >
                  <a
                    className="cursor-pointer text-[#71717b] text-sm leading-5"
                    data-id="f24247bb-1c1f-5576-8aa7-262b597d535b"
                  >
                    About Us
                  </a>
                  <a
                    className="cursor-pointer text-[#71717b] text-sm leading-5"
                    data-id="84e06810-a2b4-5fe9-9675-525d709e6a31"
                  >
                    Blog
                  </a>
                  <a
                    className="cursor-pointer text-[#71717b] text-sm leading-5"
                    data-id="ff4495d8-f2db-52ae-b4c6-e8220e4559f5"
                  >
                    Privacy Policy
                  </a>
                  <a
                    className="cursor-pointer text-[#71717b] text-sm leading-5"
                    data-id="951bb93a-f8e8-5c3d-a186-9d43535b1ab8"
                  >
                    Contact
                  </a>
                </div>
              </div>
            </div>
            <Separator
              className="my-8"
              data-id="7e6cee7b-2437-55a0-b9c9-32441865928e"
            />
            <div
              className="flex justify-between items-center"
              data-id="36d9be4a-041d-5cfa-8bd9-6dc5774fec1a"
            >
              <span
                className="text-[#71717b] text-xs leading-4"
                data-id="d88df245-36b8-5adb-89aa-c2eba6d97125"
              >
                © 2025 GradHub. All rights reserved.
              </span>
              <span
                className="text-[#71717b] text-xs leading-4"
                data-id="3a254faf-2ec8-5003-9219-394ba671574f"
              >
                Made with
                <Heart
                  className="size-3 inline text-[#f0b100]"
                  data-id="31ad6978-4462-5dc3-bdac-dd5e591ff4a4"
                />
                for graduates everywhere
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
