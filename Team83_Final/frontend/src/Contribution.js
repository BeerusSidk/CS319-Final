import { useForm } from 'react-hook-form';

export function Contribution() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    const onSubmit = (data) => {
        fetch("http://localhost:8080/contributions", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                "dishName": data.dishName,
                "description": data.description,
                "category": data.category,
                "imageUrl": data.imageUrl,
                "ingredients": data.ingredients
            })
        })
            .then(() => {
                reset();
            });

    };

    return (
        <>
            <div className="d-block mx-auto mt-3">
                <h4>Wanna Spread Vietnamese Dishes?!</h4>
                <div className="container mt-3" style={{ width: '500px' }}>
                    <form id="addProductForm" onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <label htmlFor="dishName">Dish Name:</label>
                            <input {...register("dishName", { required: true })} type="text" className="form-control" id="dishName" placeholder="Dish's name" />
                            {errors.dishName && <p className="text-danger">Dish's name is required.</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="category">Category:</label>
                            <input {...register("category", { required: true })} type="text" className="form-control" id="category" placeholder='Category' />
                            {errors.category && <p className="text-danger">Category is required.</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description:</label>
                            <textarea {...register("description", { required: true })} className="form-control" id="description" rows="3" placeholder="Dish's Description"></textarea>
                            {errors.description && <p className="text-danger">Description is required.</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="ingredients">Ingredients:</label>
                            <textarea {...register("ingredients", { required: true })} className="form-control" id="ingredients" rows="3" placeholder='Ingredients separated by comma...'></textarea>
                            {errors.ingredients && <p className="text-danger">Ingredients are required.</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="image">Image URL:</label>
                            <input {...register("imageUrl", { required: true })} type="url" className="form-control" id="image" placeholder='Image for Illustration' />
                            {errors.imageUrl && <p className="text-danger">Image URL is required.</p>}
                        </div>
                        <button type="submit" className="btn btn-primary mt-3" >Contribute for Review!</button>
                    </form>
                </div>
            </div>
        </>
    );
}