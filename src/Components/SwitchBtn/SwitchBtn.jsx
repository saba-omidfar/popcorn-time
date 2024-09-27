import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 144,
  height: 29,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    left: 0,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(69px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "transparent",
        border: "1px solid #9d1a15",
        opacity: 1,
      },
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: 1,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    borderRadius: 15,
    width: 142 / 2,
    height: 25,
    backgroundColor: "#9d1a15",
  },
  "& .MuiSwitch-track": {
    borderRadius: 15,
    backgroundColor: "transparent",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
    border: "1px solid #9d1a15",
  },
}));

const SwitchBtn = ({ checked, onChange }) => {
  return (
    <div style={{ position: "relative", width: 144, height: 28 }}>
      <IOSSwitch checked={checked} onChange={onChange} />
      <span
        style={{
          position: "absolute",
          left: 24,
          top: 3,
          fontSize: 13,
          color: "#c4c4c4",
          zIndex: 1,
          cursor: "pointer",
        }}
        onClick={() => onChange({ target: { checked: false } })}
      >
        امروز
      </span>
      <span
        style={{
          position: "absolute",
          right: 15,
          top: 3,
          fontSize: 13,
          color: "#c4c4c4",
          zIndex: 1,
          cursor: "pointer",
        }}
        onClick={() => onChange({ target: { checked: true } })}
      >
        این هفته
      </span>
    </div>
  );
};

export default SwitchBtn;
