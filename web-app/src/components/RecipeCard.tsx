import { Link } from 'react-router-dom';
import { RecipePreview } from '../interfaces/Recipe';

const RecipeCard = ({ _id, image, name }: RecipePreview) => {
    return (
        <div className="carousel-item-inner">
            <Link to={`/recipes/${_id}`} className="recipe-card">
                <div className="recipe-image-container">
                    <img src={image || 'https://via.placeholder.com/150'} alt={name} />
                </div>
                <div className="recipe-name-banner">
                    <h3>{name}</h3>
                </div>
            </Link>
        </div>
    );
};

export default RecipeCard;
