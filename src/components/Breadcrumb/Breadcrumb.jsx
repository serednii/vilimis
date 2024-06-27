import { useLocation, Link } from "react-router-dom";
import { useId } from "react";
import { urlTree } from "./urlTree";
import {House} from "@phosphor-icons/react";

function containsNumber(value) {
  return /^\d$/.test(value);
}

const Breadcrumb = () => {
  const location = useLocation();
  const pathName = location.pathname;
  //Відкидаємо перший пустий символ, що означає головна сторінка і там де є тільки число
  const breadcrumbs = pathName
    .split("/")
    .filter((crumb) => crumb && !containsNumber(crumb));
  console.log(breadcrumbs);
  return (
    <>
      {pathName !== "/" && (
        <nav aria-label="breadcrumb" className="d-none d-md-inline-block">
          <ol className="breadcrumb breadcrumb-dark breadcrumb-transparent">
            <li className="breadcrumb-item">
              <Link to="/">
                <House size={16}/>
              </Link>
            </li>

            {breadcrumbs.map((el, index, breadcrumbs) => {
              switch (index) {
                case 0:
                  return (
                    <li key={index} className="breadcrumb-item">
                      <Link to={el}>{urlTree[el] && urlTree[el][el]}</Link>
                    </li>
                  );
                case 1:
                  return (
                    <li key={index} className="breadcrumb-item">
                      <span>{urlTree[breadcrumbs[0]] && urlTree[breadcrumbs[0]][el]}</span>
                    </li>
                  );
              }
            })}
          </ol>
        </nav>
      )}
    </>
  );
};

export default Breadcrumb;
