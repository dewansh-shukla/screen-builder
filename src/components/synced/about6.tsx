// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/about6.tsx
// Last synced: 2026-03-17T11:05:34.426Z
// API integrations stripped. Use props for data and callbacks.
'use client';

import { Avatar } from '@/components/base/avatar/avatar';
import { Instagram, LinkedIn, X } from '@/components/foundations/social-icons';

const teamMembers = [
  {
    name: 'Abhishek',
    title: 'GM, Karnataka',
    summary: 'More than a decade in the online and offline celebration product space. Created party supply brands for major e-commerce platforms. Deep knowledge in supply, procurement, and product design. Worked with over 200 corporate clients and events, such as Sunburn, IPL, Pro Kabaddi and more.',
    avatarUrl: '/assets/images/about-us/abhishek.png',
    socials: [
      { icon: Instagram, href: 'https://www.instagram.com/abhishek_shettyy/' },
    ]
  },
  {
    name: 'Bhaskar',
    title: 'Cross Functional Lead',
    summary: 'With a keen eye for design and adept at learning new technologies, Bhaskar has taught courses on AI.  At Zapigo, he has cross-functional roles across content, design and engineering.',
    avatarUrl: '/assets/images/about-us/bhaskar.png',
    socials: [
      { icon: LinkedIn, href: 'https://www.linkedin.com/in/bsb1998/' },
      { icon: Instagram, href: 'https://www.instagram.com/bas_kar_shiva/' },
    ],
  },
  {
    name: 'Dewansh',
    title: 'Engineer',
    summary: 'Software engineer with a passion for solving complex problems. Skilled in multiple programming languages. Experienced in developing scalable systems. At Zapigo, he has designed foundational and cross-platform systems integrating multiple engineering functions and roles.',
    avatarUrl: '/assets/images/about-us/dewansh.png',
    socials: [
      { icon: LinkedIn, href: 'https://www.linkedin.com/in/dewansh-shukla-101/' },
    ],
  },
  {
    name: 'Shoba',
    title: 'Co-founder and Content Lead',
    summary: 'Author, columnist, journalist, poet, podcaster and content creator. At Zapigo, she combines her lifelong passion for psychology with content creation to enhance the user experience.',
    avatarUrl: '/assets/images/about-us/shoba.png',
    socials: [
      { icon: X, href: 'https://x.com/ShobaNarayan' },
      { icon: LinkedIn, href: 'https://www.linkedin.com/in/shobanarayan/' },
      { icon: Instagram, href: 'https://www.instagram.com/shobanarayan/' },
    ],
  },
  {
    name: 'Vikram',
    title: 'Co-founder and CEO',
    summary: '20+ years of global experience, 15 in product management roles. Retail and eCommerce veteran. Loves building and leading teams to success in multiple functional areas. Obsessed with user experience modeling & design.',
    avatarUrl: '/assets/images/about-us/vikram.png',
    socials: [
      { icon: X, href: 'https://x.com/hiresavi' },
      { icon: LinkedIn, href: 'https://www.linkedin.com/in/hiresavi/' },
      { icon: Instagram, href: 'https://www.instagram.com/hiresavi/' },
    ],
  }
];

const About6 = () => {
  return (
    <section className="pb-8">
      {/* Zapigo section */}
      <section className="bg-primary py-8 lg:py-8 pt-8">
        <div className="mx-auto grid max-w-container grid-cols-1 gap-16 overflow-hidden px-4 md:px-8 lg:grid-cols-2 lg:items-center">
          <div className="flex max-w-3xl flex-col items-start">
            <h2 className="mt-3 text-display-sm font-semibold text-primary md:text-display-md">Our Vision</h2>
            <p className="mt-4 text-lg text-tertiary md:mt-5 md:text-xl">
              In India, there’s no such thing as “just another day.” Someone, somewhere is cutting cake, smashing coconuts, or stuffing friends with gulab jamuns. Celebrations aren’t just dates on a calendar — they’re the heartbeat of our lives. Celebrations are where we greet new babies, gather with friends over chai or champagne, and gift smiles, memories, and blessings.
              <br />
              <br />
              At Zapigo, we believe life’s too short for boring celebrations. From the moment you invite your first guest to the moment you share your last photograph, we’re here to make sure joy is the only thing on your to-do list. <span className="font-bold">So we built India’s first all-in-one celebrations platform.</span>
              <br />
              <br />
              We give you gorgeous digital invites, and celebration tools so smooth, even your tech-challenged chacha can use them. Best of all, your invites get RSVPs without 47 reminders, missed calls, or increasingly frantic “Did you get my invite?” messages. Whether you’re planning your child’s birthday, or a brunch bash for your closest 140 friends, we are here to make it easy, elegant and exuberant.
              <br />
              <br />
              <span className="font-bold">Zapigo: Celebrations Reimagined.</span>
            </p>
          </div>

          <div className="grid h-122 w-[150%] grid-cols-[repeat(12,1fr)] grid-rows-[repeat(12,1fr)] gap-2 justify-self-center sm:h-124 sm:w-[120%] md:w-auto md:gap-4">
            <img
              src="https://ik.imagekit.io/zapigo/1%20celebration-deity-navratri.jpg"
              className="size-full object-cover"
              alt="Megan Sims"
              style={{
                gridArea: "7 / 5 / 13 / 9",
              }}
            />
            <img
              src="https://ik.imagekit.io/zapigo/6%20portrait-holi-powder-colors-celebration.jpg"
              className="size-full object-cover"
              alt="Nic Davidson"
              style={{
                gridArea: "1 / 7 / 7 / 11",
              }}
            />
            <img
              src="https://ik.imagekit.io/zapigo/5%20indian-men-celebrate-independence-day.jpg"
              className="size-full object-cover"
              alt="Amelie Laurent"
              style={{
                gridArea: "3 / 3 / 7 / 7",
              }}
            />
            <img
              src="https://ik.imagekit.io/zapigo/4%20christmas-tree-is-church-with-candles-cross-table.jpg"
              className="size-full object-cover"
              alt="Lily-Rose Chedjou"
              style={{
                gridArea: "7 / 9 / 11 / 13",
              }}
            />
            <img
              src="https://ik.imagekit.io/zapigo/5%20group-people-are-gathered-around-fire-that-has-large-number-people-colorful-saris.jpg"
              className="size-full object-cover"
              alt="Levi Rocha"
              style={{
                gridArea: "7 / 1 / 12 / 5",
              }}
            />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <div className="bg-primary py-16 lg:py-24">
        <div className="mx-auto max-w-container px-4 md:px-8">
          <div className="flex flex-col gap-12 lg:flex-row lg:gap-24">
            <div className="flex shrink-0 flex-col items-start lg:w-87">
              <span className="text-brand-secondary text-sm font-semibold md:text-base">
                Our team
              </span>
              <h2 className="font-literata mt-3 text-2xl font-semibold md:text-4xl">
                Leadership team
              </h2>
              <p className="mt-4 text-lg text-gray-600 md:mt-5 md:text-xl">
                We&apos;re a bunch of nature-lovers with the firm belief that “one-more by-two filter-coffee” is a legitimate life philosophy. We grew up with train journeys, monsoon rain, antakshari, and the sacred tradition of never leaving a party without a dabba of leftovers. We’re dreamers, designers, and doers who believe that occasions— big or small— are always worth celebrating.
              </p>
            </div>

            <ul className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:ml-3 lg:grid-cols-2 xl:grid-cols-3">
              {teamMembers.map((item) => (
                <li key={item.name} className="flex gap-4 md:flex-col md:gap-5">
                  <Avatar
                    src={item.avatarUrl}
                    alt={item.name}
                    size="2xl"
                    className="size-20 md:size-24"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-brand-secondary text-base">
                      {item.title}
                    </p>
                    <p className="mt-2 text-base text-gray-600">
                      {item.summary}
                    </p>
                    <ul className="mt-4 flex gap-4">
                      {item.socials.map((social, index) => (
                        <li key={index}>
                          <a
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex rounded text-gray-400 transition duration-100 ease-linear hover:text-gray-600 focus-visible:outline-2 focus-visible:outline-offset-2"
                          >
                            <social.icon className="size-5" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export { About6 };
