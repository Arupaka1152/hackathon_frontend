import "./Home.css";
import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="home-div">
            <Link to="/signup"><div className="signup-link" >アカウント登録はこちらから</div></Link>
            <Link to="/login"><div className="login-link" >ログインはこちらから</div></Link>
        </div>
    );
}

export default Home;
