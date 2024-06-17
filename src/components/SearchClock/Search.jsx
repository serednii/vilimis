import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const SearchClock = () => {
const [isOpen, setIsOpen] = useState(false)
    const handleClick = () => {

    }

    return (
    
        <button onClick={handleClick}>
            <FontAwesomeIcon  icon={faClock}/>
        </button>

    
    )
}

export default SearchClock;