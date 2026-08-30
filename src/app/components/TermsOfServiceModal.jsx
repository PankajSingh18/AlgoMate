import Modal from "@/app/components/ui/Modal";

export const termsSections = [
  {
    id: "1",
    title: "Acceptance of Terms",
    data: "By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.",
  },
  {
    id: "2",
    title: "Use License",
    points: [
      "Permission is granted to temporarily use the materials on this website for personal, non-commercial transitory viewing only",
      "This is the grant of a license, not a transfer of title",
      "You may not modify or copy the materials, use them for any commercial purpose, or remove any copyright or proprietary notations",
    ],
  },
  {
    id: "3",
    title: "User Responsibilities",
    points: [
      "Provide accurate and complete information when required",
      "Maintain the confidentiality of your account credentials",
      "Notify us immediately of any unauthorized use of your account",
      "Use the service in compliance with all applicable laws and regulations",
    ],
  },
  {
    id: "4",
    title: "Intellectual Property",
    data: "All content, features, and functionality on this website, including but not limited to text, graphics, logos, and software, are the exclusive property of the company and are protected by international copyright, trademark, and other intellectual property laws.",
  },
  {
    id: "5",
    title: "Limitation of Liability",
    data: "In no event shall the company, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.",
  },
  {
    id: "6",
    title: "Governing Law",
    data: "These Terms shall be governed and construed in accordance with the laws of the applicable jurisdiction, without regard to its conflict of law provisions.",
  },
  {
    id: "7",
    title: "Changes to Terms",
    data: "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms.",
  },
  {
    id: "8",
    title: "Contact Information",
    data: "If you have any questions about these Terms, please contact us at",
    contact: "hello@algobuddy.in",
  },
];

const TermsOfServiceModal = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Terms of Service"
      size="lg"
      footer={
        <button
          onClick={onClose}
          className="w-full sm:w-auto px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900 text-[15px] dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 shadow-sm"
        >
          I Agree
        </button>
      }
    >
      <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
        <p className="mb-8 text-neutral-600 dark:text-neutral-400 leading-relaxed text-[15px]">
          Please read these terms and conditions carefully before using our
          website and services. Your access to and use of the service is
          conditioned on your acceptance of and compliance with these terms.
        </p>

        <div className="space-y-8">
          {termsSections.map((item, index) => (
            <section 
              key={index} 
              className="border-b border-neutral-100 dark:border-neutral-800/50 pb-8 last:border-0 last:pb-0"
            >
              <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3 flex items-baseline gap-2 tracking-tight">
                <span className="text-neutral-400 dark:text-neutral-500 font-mono text-sm select-none">{item.id}.</span>
                {item.title}
              </h3>
              
              {item.points && (
                <ul className="space-y-2.5 text-neutral-600 dark:text-neutral-400 pl-6 m-0">
                  {item.points.map((subitem, subindex) => (
                    <li 
                      key={subindex} 
                      className="list-disc pl-1 marker:text-neutral-300 dark:marker:text-neutral-600"
                    >
                      <span className="leading-relaxed text-[15px]">{subitem}</span>
                    </li>
                  ))}
                </ul>
              )}
              
              {item.data && (
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-[15px] m-0">
                  {item.data}
                </p>
              )}
              
              {item.contact && (
                <div className="mt-3">
                  <a
                    href={`mailto:${item.contact}`}
                    className="inline-flex font-medium text-neutral-900 dark:text-neutral-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {item.contact}
                  </a>
                </div>
              )}
            </section>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-neutral-100 dark:border-neutral-800/60">
          <p className="text-sm text-neutral-500 dark:text-neutral-500 m-0">
            Last updated: May 17, 2025
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default TermsOfServiceModal;
