import React from 'react';
import './Airdrop.modal.css'; // Importing the modal CSS

interface RewardModalProps {
  onClose: () => void;
  onReward: (coins: number) => void;
}

const RewardModal: React.FC<RewardModalProps> = ({ onClose }) => {
  return (
    <div className="roadmap-modal-backdrop ">
      <div className="roadmap-modal-content w-full bg-[#16181b] text-white ">
        <h2 className="roadmap-title">Airdrop Roadmap</h2>

        <div className="roadmap-step">
          <h3>1. Preparation and Public Announcement</h3>
          <p>
            <strong>Goal:</strong> Raise awareness and attract initial users' attention.
            <br />
            <strong>Actions:</strong>
            <ul>
              <li>Design marketing campaigns to promote on social media.</li>
              <li>Create landing pages and announce the rules and conditions for participating in the Airdrop.</li>
              <li>Collaborate with influencers and reputable media for press coverage.</li>
            </ul>
          </p>
        </div>

        <div className="roadmap-step">
          <h3>2. User Pre-registration</h3>
          <p>
            <strong>Goal:</strong> Attract a specific number of early participants.
            <br />
            <strong>Actions:</strong>
            <ul>
              <li>Open the platform for pre-registration.</li>
              <li>Send confirmation emails and offer incentives for referring friends.</li>
              <li>Provide and explain the necessary steps for participating in the Airdrop.</li>
            </ul>
          </p>
        </div>

        <div className="roadmap-step">
          <h3>3. Airdrop Launch</h3>
          <p>
            <strong>Goal:</strong> Distribute tokens and increase user engagement.
            <br />
            <strong>Actions:</strong>
            <ul>
              <li>Begin the token distribution process based on set criteria.</li>
              <li>Monitor and closely track to prevent fraud.</li>
              <li>Provide periodic reports and statistics to users for greater transparency.</li>
            </ul>
          </p>
        </div>

        <div className="roadmap-step">
          <h3>4. End of Airdrop and Analysis of Results</h3>
          <p>
            <strong>Goal:</strong> Analyze the success of the campaign.
            <br />
            <strong>Actions:</strong>
            <ul>
              <li>Summarize and provide a final report on the number of users and tokens distributed.</li>
              <li>Review user feedback and analyze data on new user acquisition.</li>
              <li>Evaluate the growth of the project and network development.</li>
            </ul>
          </p>
        </div>

        <div className="roadmap-step">
          <h3>5. Post-Airdrop</h3>
          <p>
            <strong>Goal:</strong> Retain users and continue growth.
            <br />
            <strong>Actions:</strong>
            <ul>
              <li>Offer incentives for holding onto tokens.</li>
              <li>Announce future project plans and new launches.</li>
              <li>Host new events and engage with the user community.</li>
            </ul>
          </p>
        </div>

        {/* Close button at the bottom of the modal */}
        <div className="modal-footer">
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RewardModal;
