import Modal from "@/app/components/ui/Modal";

const codeOfConductSections = [
  {
    id: "1",
    title: "Our Pledge",
    points: [
      "We as contributors and maintainers pledge to make participation in this project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.",
      "We are committed to creating an open, welcoming, inclusive, and respectful environment for everyone.",
    ],
  },
  {
    id: "2",
    title: "Our Standards",
    points: [
      "Being respectful and inclusive",
      "Using welcoming and constructive language",
      "Respecting differing viewpoints and experiences",
      "Gracefully accepting constructive criticism",
      "Helping other contributors and community members",
      "Harassment or discriminatory language",
      "Personal attacks or trolling",
      "Public or private harassment",
      "Publishing others’ private information without permission",
      "Any conduct that could be considered inappropriate in a professional setting",
    ],
  },
  {
    id: "3",
    title: "Contributor Responsibilities",
    data: "Contributors are expected to:",
    points: [
      "Follow project guidelines",
      "Maintain respectful communication",
      "Focus on collaboration and learning",
      "Report inappropriate behavior if encountered",
    ],
  },
  {
    id: "4",
    title: "Enforcement",
    data: "Project maintainers are responsible for clarifying and enforcing standards of acceptable behavior and may take appropriate corrective action in response to any instances of unacceptable behavior.",
  },
  {
    id: "5",
    title: "Reporting Issues",
    data: "If you experience or witness unacceptable behavior, please report it to the project maintainers through the repository issue section or the official project contact channels. All complaints will be reviewed and investigated promptly and fairly.",
  },
  {
    id: "6",
    title: "Your Choices",
    data: "This Code of Conduct applies within all project spaces, including:",
    points: [
      "GitHub repositories",
      "Discussions",
      "Pull requests",
      "Community chats",
      "Social platforms related to the project",
    ],
  },
  {
    id: "7",
    title: "Attribution",
    data: "This Code of Conduct is inspired by the Contributor Covenant, version 2.1.",
  },
];

const CodeOfConductModal = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Code Of Conduct"
      size="lg"
      footer={
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="rounded-full bg-neutral-900 dark:bg-white px-6 py-2.5 text-sm font-semibold text-white dark:text-neutral-900 transition-all duration-200 hover:bg-neutral-800 dark:hover:bg-neutral-100"
          >
            Accept & Close
          </button>
        </div>
      }
    >
      <p className="mb-6 leading-relaxed text-neutral-600 dark:text-neutral-400">
        This Code of Conduct outlines the standards of behavior expected
        from all users and contributors of our platform. It explains our
        commitment to creating a respectful, inclusive, and collaborative
        environment, along with the responsibilities, reporting process, and
        actions taken to maintain a positive community experience.
      </p>

      <div className="space-y-6">
        {codeOfConductSections.map((item, index) => (
          <div key={index} className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 p-5">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700 font-semibold text-neutral-600 dark:text-neutral-400 text-sm">
                {item.id}
              </span>
              <div className="flex-1">
                <h3 className="mb-2 text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  {item.title}
                </h3>
                {item.points && (
                  <ul className="space-y-1.5">
                    {item.points.map((subitem, subindex) => (
                      <li key={subindex} className="list-disc ml-5 pl-1 text-sm text-neutral-600 dark:text-neutral-400">
                        {subitem}
                      </li>
                    ))}
                  </ul>
                )}
                {item.data && (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {item.data}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t border-neutral-200 dark:border-neutral-700 pt-4">
        <p className="text-xs text-neutral-500">Last updated: May 17, 2025</p>
      </div>
    </Modal>
  );
};

export default CodeOfConductModal;
