import { useLocation, Link } from "react-router-dom";
import { useId } from "react";
import { urlTree } from "./urlTree";

function containsNumber(value) {
  return /^\d$/.test(value);
}

const Breadcrumb = () => {
  const location = useLocation();
  const pathName = location.pathname;
  const [id] = pathName.split('/').filter(crumb => containsNumber(crumb));
  //We discard the first empty character, which means the main page and the last id
  const breadcrumbs = pathName
    .split("/")
    .filter((crumb) => crumb && !containsNumber(crumb));

  return (
    <>
      {pathName !== "/" && (
        <nav aria-label="breadcrumb" className="d-none d-md-inline-block">
          <ol className="breadcrumb breadcrumb-dark breadcrumb-transparent">
            <li className="breadcrumb-item">
              <Link to="/">
                <svg
                  className="icon icon-xxs"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  ></path>
                </svg>
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
                      <span>{urlTree[breadcrumbs[0]] && urlTree[breadcrumbs[0]][el]}  {id && (`/  ${id}`) }</span>
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
