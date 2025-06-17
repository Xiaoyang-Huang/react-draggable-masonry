# React-Draggable-Masonry

An open source library to provider a draggable masonry layout for your react projects, the layout is implmented by CSS and the lib is lightweight, only dependent on react.

# Demo

[Check here](https://xiaoyang-huang.github.io/react-draggable-masonry/)

# Install

```shell
npm install --save react-draggable-masonry
```

# Usage

Check the examples in [demo folder](src/demo)

# API

## Wall

|       Prop       |           Type           | Description                                                                                                                       |
| :--------------: | :----------------------: | --------------------------------------------------------------------------------------------------------------------------------- |
|   columnWidth    |     number \| string     | width of a brick                                                                                                                  |
|    rowHeight     |     number \| string     | height of a brick                                                                                                                 |
|       gap        |     number \| string     | space between brick                                                                                                               |
| allowDragInSpace |         boolean          | allow brick to drag into this wall                                                                                                |
|     dragMode     |   "normal" \| "adapt"    | the way to manage the brick size while drag and drop:<br/>normal: keep the source size<br/>adapt: resize to target size           |
|     swapMode     | "internal" \| "external" | the way to manage the bricker order:<br/>internal: swap bricks with DOM operation<br/>external: leave the DOM management to React |
|     children     |        reactNode         | any react component                                                                                                               |

## Concrete

usually you don't need to use this component

|   Prop   |  Type  | Description                      |
| :------: | :----: | -------------------------------- |
|    id    | string | unique id for the brick children |
|  index   | number | bricker order index in wall      |
| children | Brick  | Bricker component                |

## Brick

Inherit all props from HTMLDIVElement and also have following props additional

|    Prop     |   Type    | Description                                                                                                                        |
| :---------: | :-------: | ---------------------------------------------------------------------------------------------------------------------------------- |
|  draggable  |  boolean  | enable/disable drag function on brick                                                                                              |
|    width    |  number   | how many cells in row will filled by this brick                                                                                    |
|   height    |  number   | how many cells in columns will filled by this brick                                                                                |
| allowToSwap |  boolean  | set to false if you want a fixed brick, otherwise if a draggable birck move on this brick, it will swap the position with that one |
|  children   | reactNode | any react component                                                                                                                |

# Mobile Support

Tested with [drag-drop-touch](https://www.npmjs.com/package/drag-drop-touch) and it able to work with mobile devices.
check our [demo code](src/index.tsx#L5), you need install the package and import that to enable the mobile support.
