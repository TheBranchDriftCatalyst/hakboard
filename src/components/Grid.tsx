// function MyGrid(props) {
//   const children = React.useMemo(() => {
//     return new Array(props.count).fill(undefined).map((val, idx) => {
//       return <div key={idx} data-grid={{ x: idx, y: 1, w: 1, h: 1 }} />;
//     });
//   }, [props.count]);
//   return <ReactGridLayout cols={12}>{children}</ReactGridLayout>;
// }