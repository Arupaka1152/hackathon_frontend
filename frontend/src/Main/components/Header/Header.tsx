import Report from "../../Report";
import "./Header.css"

type headerProps = {
    title: string
}

function Header(props: headerProps) {
    return (
        <div className="Header-container">
            <div className="Header-title">{props.title}</div>
        </div>
    )
}

export default Header;