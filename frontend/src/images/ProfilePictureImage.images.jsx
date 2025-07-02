import { Image } from "react-bootstrap";
import NoProfilePicture from "../assets/NoProfilePicture.jpg"

const ProfilePicture = ({ profilePicture, width = "120px", height = "120px" }) => {
    return (
        <div style={{ position: "relative", display: "inline-block", width, height }} className="m-3">
            {/* Profile Image */}
            <Image
                src={!profilePicture && !profilePicture.endsWith('null')
                            ? profilePicture
                            : NoProfilePicture}
                roundedCircle
                style={{
                    width,
                    height,
                    objectFit: "cover",
                    border: "3px solid rgb(255, 255, 255)", // Bootstrap primary color
                    padding: "3px",
                }}
            />
        </div>
    );
};

export default ProfilePicture;