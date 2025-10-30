import Image from "next/image";

interface TechIconProps {
  src: string;
  alt: string;
}

function TechIcon({ src, alt }: TechIconProps) {
  return (
    <div className="group relative">
      <Image
        src={src}
        alt={alt}
        width={40}
        height={40}
        className="object-contain transition-transform hover:scale-110"
      />
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        {alt}
      </div>
    </div>
  );
}

export default function AboutMe() {
  return (
    <section id="about" className="mt-24 scroll-mt-24">
      <h3 className="text-3xl font-semibold mb-8">About Me</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-6">
          <div className="w-48 h-48 mx-auto lg:mx-0 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
            <Image
              src="/self-photo.png"
              alt="Jake Armijo"
              width={192}
              height={192}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="space-y-4 text-zinc-600 dark:text-zinc-400">
            <p className="text-lg leading-relaxed">
              [ Hello, World, ! ] I am a sociable creator with adoration for variety. 
              As a kid, I lived frequently singing and playing with Legos or Erector sets. 
              As an adult, I helped build commercial buildings, and now I help build software solutions. 
              All while still singing.
            </p>
            <p className="text-lg leading-relaxed">
              I have a swiss army knife-like mindset and love to learn new things. 
              I am a versatile team player with a vivid imagination. My off-hours creative 
              activities include golfing, fly tying, djing, and making my family laugh. 
              I am always willing to chat. Feel free to message me!
            </p>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-500">
              Career switcher 2020 - Girl Dad - Fly Fisher
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <h4 className="text-xl font-semibold mb-6">Technologies I&apos;ve Worked With</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h5 className="font-medium text-zinc-900 dark:text-zinc-100">Frontend</h5>
              <div className="flex flex-wrap gap-3">
                <TechIcon src="/ReactLogo.png" alt="React" />
                <TechIcon src="/VUEjsLogo.png" alt="Vue.js" />
                <TechIcon src="/ReduxLogo.png" alt="Redux" />
                <TechIcon src="/HTMLLogo.png" alt="HTML" />
                <TechIcon src="/CSSLogo.png" alt="CSS" />
                <TechIcon src="/styled-components.png" alt="Styled Components" />
                <TechIcon src="/Bootstrap-Logo.png" alt="Bootstrap" />
              </div>
            </div>

            <div className="space-y-4">
              <h5 className="font-medium text-zinc-900 dark:text-zinc-100">Backend</h5>
              <div className="flex flex-wrap gap-3">
                <TechIcon src="/NodeLogo.png" alt="Node.js" />
                <TechIcon src="/ExpressLogo.png" alt="Express" />
                <TechIcon src="/FastAPILogo.png" alt="FastAPI" />
                <TechIcon src="/SequelizeLogo.png" alt="Sequelize" />
                <TechIcon src="/PostgresLogo.png" alt="PostgreSQL" />
                <TechIcon src="/MongoDBLogo.png" alt="MongoDB" />
                <TechIcon src="/SocketIO.png" alt="Socket.io" />
              </div>
            </div>

            <div className="space-y-4">
              <h5 className="font-medium text-zinc-900 dark:text-zinc-100">DevOps</h5>
              <div className="flex flex-wrap gap-3">
                <TechIcon src="/GitLogo.png" alt="Git" />
                <TechIcon src="/GitHubLogo.png" alt="GitHub" />
                <TechIcon src="/NpmLogo.png" alt="NPM" />
                <TechIcon src="/WebpackLogo.png" alt="Webpack" />
                <TechIcon src="/HerokuLogo.png" alt="Heroku" />
                <TechIcon src="/TravisCILogo.png" alt="Travis CI" />
                <TechIcon src="/DockerLogo.png" alt="Docker" />
                <TechIcon src="/TerraformLogo_2.png" alt="Terraform" />
                <TechIcon src="/DatadogLogo.png" alt="Datadog" />
              </div>
            </div>

            <div className="space-y-4">
              <h5 className="font-medium text-zinc-900 dark:text-zinc-100">Languages</h5>
              <div className="flex flex-wrap gap-3">
                <TechIcon src="/Javascript-Logo.png" alt="JavaScript" />
                <TechIcon src="/Python-Logo.png" alt="Python" />
              </div>
            </div>

            <div className="space-y-4">
              <h5 className="font-medium text-zinc-900 dark:text-zinc-100">Tools</h5>
              <div className="flex flex-wrap gap-3">
                <TechIcon src="/VSCODE-logo.png" alt="VS Code" />
                <TechIcon src="/Postman-Logo.png" alt="Postman" />
                <TechIcon src="/Postico-logo.png" alt="Postico" />
              </div>
            </div>

            <div className="space-y-4">
              <h5 className="font-medium text-zinc-900 dark:text-zinc-100">Testing</h5>
              <div className="flex flex-wrap gap-3">
                <TechIcon src="/MochaLogo.png" alt="Mocha" />
                <TechIcon src="/Chai-Logo.png" alt="Chai" />
              </div>
            </div>

            <div className="space-y-4">
              <h5 className="font-medium text-zinc-900 dark:text-zinc-100">Cloud & Certifications</h5>
              <div className="flex flex-wrap gap-3">
                <TechIcon src="/AWSLogo.svg" alt="AWS" />
                <TechIcon src="/dev_ass_cert.png" alt="AWS Developer Associate" />
                <TechIcon src="/dev_ops_cert.png" alt="AWS DevOps Professional" />
                <TechIcon src="/AzureLogo.png" alt="Azure" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
