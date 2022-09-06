import {
  Slider,
  SliderMark,
  SliderTrack,
  SliderFilledTrack,
  Tooltip,
  SliderThumb,
} from "@chakra-ui/react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import React, { FunctionComponent } from "react";

interface StarSliderProps {}

const StarSlider: FunctionComponent<StarSliderProps> = () => {
  const [sliderValue, setSliderValue] = React.useState(5);
  const [showTooltip, setShowTooltip] = React.useState(false);
  return (
    <>
      <p>
        <b>How do you rate this run?</b> {sliderValue / 2} out of 5
      </p>
      <Slider
        id="slider"
        defaultValue={5}
        min={0}
        max={10}
        step={1}
        colorScheme="teal"
        onChange={(v) => setSliderValue(v)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <Tooltip
          hasArrow
          bg="teal.500"
          color="white"
          placement="top"
          isOpen={showTooltip}
          label={`${sliderValue / 2}`}
        >
          <SliderThumb />
        </Tooltip>
      </Slider>
    </>
  );
};

export default StarSlider;
