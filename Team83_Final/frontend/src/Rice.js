import { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';

export function Rice() {
    const [view, setView] = useState(true); // true displays all dishes, false display 1 dish in details
    const [oneDish, setOneDish] = useState({});
    const [dishes, setDishes] = useState([]);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/food/category/rice")
            .then(response => response.json())
            .then(dishes => setDishes(dishes));
    }, []);

    async function handleClick(id) {

        await fetch("http://localhost:8080/food/" + id)
            .then(response => response.json())
            .then(dish => setOneDish(dish));

        fetch("http://localhost:8080/reviews/" + id)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(comments => setReviews(comments))
            .catch(err => console.log("No reviews for this dish!"));

        setView(false);
    }

    function ShowDish() {
        const Ingredients = () => {
            const components = oneDish.ingredients;
            const columns = Math.ceil(components.length / 6); // Calculate the number of columns needed

            // Create an array of arrays, where each inner array represents ingredients for one column
            const columnIngredients = Array.from({ length: columns }, (_, index) => {
                const startIndex = index * 6;
                const endIndex = Math.min(startIndex + 6, components.length);
                return components.slice(startIndex, endIndex);
            });

            return (
                <>
                    <div className="mx-3"><em><strong>Ingredients:</strong></em></div>
                    <div className="d-flex justify-content-between align-items-start">
                        {columnIngredients.map((column, columnIndex) => (
                            <ul key={columnIndex} className="mx-3">
                                {column.map((ingredient, index) => (
                                    <li key={index} className="component">{ingredient}</li>
                                ))}
                            </ul>
                        ))}
                    </div>

                </>
            );

        }

        const Instructions = () => {
            const steps = oneDish.how_to_cook;
            return (
                <div className="mx-3">
                    {steps.map((step, index) => (
                        <div key={index}> {/* Wrap each step within a div */}
                            <h4>Step {index + 1}.</h4>
                            <p>{step}</p>
                        </div>
                    ))}
                </div>
            );
        }

        const Review = () => {
            const {
                register,
                handleSubmit,
                formState: { errors },
                reset
            } = useForm();

            async function onSubmit(data) {
                console.log(data);
                try {
                    // Send the review data to the backend
                    await fetch(`http://localhost:8080/reviews/${oneDish.id}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    });

                    // Fetch the updated reviews for the current dish
                    await fetch(`http://localhost:8080/reviews/${oneDish.id}`)
                        .then(response => response.json())
                        .then(newReviews => setReviews(newReviews));

                } catch (error) {
                    console.error('Error adding review:', error);
                }

                reset();
            }

            const DisplayReview = () => {
                async function handleDelete(id) {
                    const confirmDelete = window.confirm("Do you want to delete this comment?");

                    if (confirmDelete) {
                        await fetch(`http://localhost:8080/reviews/${id}`, {
                            method: 'DELETE'
                        })
                            .then(response => {
                                if (response.ok) {
                                    console.log("Review deleted successfully");
                                    // Handle any UI updates after successful deletion, if needed
                                } else {
                                    throw new Error('Failed to delete review');
                                }
                            })
                            .catch(error => {
                                console.error("Error deleting review:", error);
                                // Handle any error messages or UI updates for failed deletion
                            });

                        await fetch(`http://localhost:8080/reviews/${oneDish.id}`)
                            .then(response => response.json())
                            .then(newReviews => setReviews(newReviews));
                    }
                }

                return (
                    <div className="container">
                        {reviews.map((review) => (
                            <div className="border-bottom border-secondary">
                                <div className="col-3 d-flex justify-content-start">
                                    <img src={`https://robohash.org/${review.id}`} style={{ width: '35px' }}></img>
                                    <h5 className="mt-3">{review.reviewer}, {review.rating} star(s)</h5>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span>{review.comment}</span>
                                    <small onClick={() => handleDelete(review.id)} className="text-body-secondary mx-3">Delete</small>
                                </div>
                            </div>
                        )
                        )
                        }
                    </div >
                );
            }

            return (
                <>
                    <form className="col-4 mx-3" onSubmit={handleSubmit(onSubmit)}>
                        <div className="d-flex justify-content-between align-items-center">
                            <label htmlFor="username">Username:</label>
                            <input {...register("reviewer", { required: true })} type="text" className="form-control" id="username" />
                            {errors.reviewer && <p className="text-danger">Username is required.</p>}
                        </div>
                        <div style={{ marginTop: '-7px' }}>
                            <label className="mt-3" id="ratinglabel" htmlFor="rate">Rating:</label>
                            <div className="rate mx-2">
                                <input {...register("rating")} type="radio" id="star5" name="rating" value="5" />
                                <label htmlFor="star5" title="text">5 stars</label>
                                <input {...register("rating")} type="radio" id="star4" name="rating" value="4" />
                                <label htmlFor="star4" title="text">4 stars</label>
                                <input {...register("rating")} type="radio" id="star3" name="rating" value="3" />
                                <label htmlFor="star3" title="text">3 stars</label>
                                <input {...register("rating")} type="radio" id="star2" name="rating" value="2" />
                                <label htmlFor="star2" title="text">2 stars</label>
                                <input {...register("rating")} type="radio" id="star1" name="rating" value="1" />
                                <label htmlFor="star1" title="text">1 star</label>
                            </div>
                        </div>

                        <br />
                        <div className="mt-4" id="commentlabel" htmlFor="username">Comment:</div>
                        <textarea {...register("comment")} className="form-control" id="comment" rows="3" placeholder="Enter your review..."></textarea>
                        <button type="submit" className="btn btn-primary mt-3" >Add a Review</button>
                    </form>
                    <br />
                    <h4 id="review" className="mx-3">User's Reviews</h4>
                    <DisplayReview />
                </>

            );
        }


        return (
            <>
                <div className="mx-auto">
                    <h2>{oneDish.dishName}</h2>
                </div>
                <div className="album py-5 light-gray rounded">
                    <div className="container">
                        <div className="mx-auto">
                            <img
                                src={oneDish.imageUrl}
                                className="rounded"
                                style={{ height: '500px' }}
                            />
                        </div>
                        <h4 className="mx-3 mt-3">Why you'll love this?</h4>
                        <p className="mx-3 description">{oneDish.description}</p>
                        <br />
                        <h4 className="mx-3">What you may need?</h4>
                        <Ingredients />
                        <br />
                        <h4 className="mx-3">How to make it?</h4>
                        <Instructions />
                        <br />
                        <h4 className="mx-3">Leave A Message for Others?</h4>
                        <Review />
                    </div>
                </div>
            </>
        );
    }

    const ShowAllDishes = () => {
        const listItems = dishes.map((el, index) => (
            <div className="col" key={index}>
                <div className="card shadow-sm" style={{ height: '290px' }}>
                    <img
                        src={el.imageUrl}
                        alt={`product ${index}`}
                        className="rounded mx-auto single"
                        style={{ height: '200px' }}
                        onClick={() => handleClick(el.id)}
                    />
                    <div className="card-body mx-auto">
                        <h4>{el.dishName}</h4>
                    </div>
                </div>
            </div>
        ));

        return (
            <div className="album py-5 light-gray rounded">
                <div className="container">
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                        {listItems}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {view && (
                <div className="container pt-3">
                    <div className="mx-auto">
                        <h4>Rice Dishes</h4>
                    </div>
                    <ShowAllDishes />
                </div>
            )}

            {!view && (
                <div className="container pt-3">
                    <ShowDish />
                </div>
            )}
        </>
    );
}

