const strTemplate = new Array(100).fill("try to edit me and see if I re-render").join(",");
export default function PrintRender() {
  console.log("this is rendered");
  return <div>
    <p>print render</p>
    <textarea defaultValue={"first line\n" + strTemplate} rows={10} cols={40} />
  </div>
}
