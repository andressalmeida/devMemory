import { useEffect, useState } from "react";
import { GridItemType } from "./@types/GridItemType";
import * as C from "./App.styles";
import LogoImage from "./assets/devmemory_logo.png";
import { Button } from "./components/Button";
import { InfoItem } from "./components/InfoItem";
import RestartIcon from "./svgs/restart.svg";
import { items } from "./data/items";
import { GridItem } from "./components/GridItem";
import { formatTimeElapsed } from "./utils/formatTimeElapsed";

const App = () => {
  const [playing, setPlaying] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [shownCount, setShownCount] = useState<number>(0);
  const [gridItems, setGridItems] = useState<GridItemType[]>([]);

  //verificar se os cards abertos são iguais
  useEffect(() => {
    if (shownCount === 2) {
      let opened = gridItems.filter((item) => item.shown === true);
      if (opened.length === 2) {
        //verificar se possuem mesmo id para torná-los permanentes
        if (opened[0].itemId === opened[1].itemId) {
          let tmpGrid = [...gridItems];
          for (let i in tmpGrid) {
            if (tmpGrid[i].shown === true) {
              tmpGrid[i].permanentShown = true;
              tmpGrid[i].shown = false;
            }
          }

          setGridItems(tmpGrid);
          setShownCount(0);
        } else {
          //Fechar os cards
          setTimeout(() => {
            let tmpGrid = [...gridItems];
            for (let i in tmpGrid) {
              tmpGrid[i].shown = false;
            }

            setGridItems(tmpGrid);
            setShownCount(0);
          }, 1000);
        }

        setMoveCount((moveCount) => moveCount + 1);
      }
    }
  }, [shownCount, gridItems]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (playing) {
        setTimeElapsed(timeElapsed + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [playing, timeElapsed]);

  useEffect(() => {
    resetAndCreateGrid();
  }, []);

  useEffect(() => {
    if (
      moveCount > 0 &&
      gridItems.every((item) => item.permanentShown === true)
    ) {
      setPlaying(false);
    }
  }, [moveCount, gridItems]);

  const resetAndCreateGrid = () => {
    //Resetar o jogo

    setTimeElapsed(0);
    setMoveCount(0);
    setShownCount(0);

    //Criar grid vazio

    let tmpGrip: GridItemType[] = [];
    for (let i = 0; i < items.length * 2; i++) {
      tmpGrip.push({
        itemId: null, //index do array items
        shown: false,
        permanentShown: false,
      });
    }

    //Preencher o grid

    for (let w = 0; w < 2; w++) {
      for (let i = 0; i < items.length; i++) {
        let pos = -1;

        while (pos < 0 || tmpGrip[pos].itemId !== null) {
          pos = Math.floor(Math.random() * (items.length * 2));
        }

        tmpGrip[pos].itemId = i; // posição aleatoria do grid (pos) recebe o item de index i
        //ex: tmpGrip[5].item = 2 << 5 gerado de forma aleatoria e 2 é o valor de i do loop atual
      }
    }
    //Preencher o state com o grid
    setGridItems(tmpGrip);

    //começar jogo
    setPlaying(true);
  };

  const handleItemClick = (index: number) => {
    if (playing && index !== null && shownCount < 2) {
      let tmpGrid = [...gridItems];

      if (
        tmpGrid[index].permanentShown === false &&
        tmpGrid[index].shown === false
      ) {
        tmpGrid[index].shown = true;
        setShownCount(shownCount + 1);
      }

      setGridItems(tmpGrid);
    }
  };

  return (
    <C.Container>
      <C.Info>
        <C.LogoLink href="">
          <img src={LogoImage} width="200" alt=""></img>
        </C.LogoLink>

        <C.InfoArea>
          <InfoItem label="Tempo" value={formatTimeElapsed(timeElapsed)} />
          <InfoItem label="Movimentos" value={moveCount.toString()} />
        </C.InfoArea>

        <Button
          label="Reiniciar"
          icon={RestartIcon}
          onClick={resetAndCreateGrid}
        />
      </C.Info>

      <C.GridArea>
        <C.Grid>
          {gridItems.map((item, index) => (
            <GridItem
              key={index}
              item={item}
              onClickProp={() => handleItemClick(index)}
            />
          ))}
        </C.Grid>
      </C.GridArea>
    </C.Container>
  );
};

export default App;
