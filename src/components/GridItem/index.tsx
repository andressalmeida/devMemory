import * as C from "./styles";
import { GridItemType } from "../../@types/GridItemType";
import b7svg from "../../svgs/b7.svg";
import { items } from "../../data/items";

type Props = {
  item: GridItemType;
  onClickProp: () => void;
};

export const GridItem = ({ item, onClickProp }: Props) => {
  return (
    <C.Container showBackground={item.permanentShown || item.shown} onClick={onClickProp}>
      {item.permanentShown === false && item.shown === false && (
        <C.Icon src={b7svg} opacity={.1}/>
      )}
      {(item.permanentShown || item.shown) && item.itemId !== null && (
        <C.Icon src={items[item.itemId].icon} alt="" />
      )}
    </C.Container>
  );
};
