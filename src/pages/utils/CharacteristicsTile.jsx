import React from "react";
import CharacteristicsSelection from "pages/utils/CharacteristicsSelection";
import DateSelection from "pages/utils/DateSelection";
import TextSelection from "pages/utils/TextSelection";
import TileToModal from "pages/utils/TileToModal";

const CharacteristicsTile = ({
  characteristicName,
  isText = false,
  isDate = false,
  btnLabelId,
  dialogTitle,
  dialogHelp,
  dialogItems,
  dialogDefaultIconName = null,
  dialogPreselectedItems,
  multiselection = false,
  onOk,
  children
}) => {
  // console.debug("CharacteristicsTile : characteristicName, isText, isDate = ", characteristicName, isText, isDate);
  return (
    <TileToModal btnLabelId={btnLabelId} onOk={onOk}
      selection={!isText && !isDate ? (
        <CharacteristicsSelection
          id={"details_update_" + characteristicName}
          name={characteristicName}
          title={dialogTitle}
          handleChange={null} // filled by parent (when cloning this component)
          items={dialogItems}
          initialValue={dialogPreselectedItems}
          multiselection={multiselection}
          defaultIconName={dialogDefaultIconName}
        />
      ) : isText && !isDate ? (
        <TextSelection
          id={"details_update_" + characteristicName}
          name={characteristicName} // NO "name" in input to avoid Safari mobile to display the user name :( :( :(
          title={dialogTitle}
          help={dialogHelp}
          initialValue={dialogPreselectedItems}
        />
      ) : (
        <DateSelection
          id={"details_update_" + characteristicName}
          name={characteristicName}
          title={dialogTitle}
          help={dialogHelp}
          initialValue={dialogPreselectedItems}
        />
      )} >
        {children}
    </TileToModal>
  );
};

export default CharacteristicsTile;
