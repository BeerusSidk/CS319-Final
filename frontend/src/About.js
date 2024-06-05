import nhat from './nhat.jpeg';
import khoi from './khoi.jpg';

export function About() {
    return (
        <>
            <div class="container py-4 custom-body">
                <div class="pb-3 d-flex justify-content-center align-items-center">
                    <span id="title" class="fs-4"><strong>CS 319: Construction of User Interface</strong></span>
                </div>
                <div class="pb-3 d-flex justify-content-center align-items-center">
                    <span id="title" class="fs-4"><strong>May 03, 2024</strong></span>
                </div>
                <div class="pb-3 d-flex justify-content-center align-items-center">
                    <span id="title" class="fs-4"><strong>Professor Abraham N. Aldaco Gastelum</strong></span>
                </div>
                <div class="pb-3 mb-4 d-flex justify-content-center align-items-center">
                    <span id="title" class="fs-4"><strong>Professor's Email:</strong> aaldaco@iastate.edu</span>
                </div>
                <div class="pb-3 mb-4 d-flex justify-content-center align-items-center">
                    <span id="title" class="fs-4">In this project, we develop a MERN application sharing Vietnamese recipes, implementing
                        key CRUD functionalities and ensure a user-friendly UI!
                    </span>
                </div>

                <div class="row align-items-md-stretch">
                    <div class="col-md-6">
                        <div class="h-100 p-5 bg-body-tertiary border rounded-3" id="nhat">
                            <h2 className="d-flex justify-content-center align-items-center" style={{ marginBottom: "10px" }}>Anh Nhat Le</h2>
                            <img src={nhat} alt="nhat's image" className="img-fluid rounded d-block" style={{ margin: "0 auto" }} />
                            <p style={{ marginTop: "10px" }}><strong>Email:</strong> lan0908@iastate.edu</p>
                            <p><strong>Majors:</strong> Computer Science & Applied Mathematics</p>
                            <p><strong>Classification:</strong> Freshman</p>
                            <p><strong>Hobbies:</strong> Reading Books & Novels</p>
                        </div>
                    </div>

                    <div class="col-md-6">
                        <div class="h-100 p-5 bg-body-tertiary border rounded-3" id="khoi">
                            <h2 className="d-flex justify-content-center align-items-center" style={{ marginBottom: "10px" }}>Khoi Pham</h2>
                            <img src={khoi} alt="khoi's image" className="img-fluid rounded d-block" style={{ margin: "0 auto" }} />
                            <p style={{ marginTop: "10px" }}><strong>Email:</strong> duckhoi@iastate.edu</p>
                            <p><strong>Majors:</strong> Computer Science</p>
                            <p><strong>Classification:</strong> Sophomore</p>
                            <p><strong>Hobbies:</strong> Chemistry</p>
                        </div>
                    </div>
                </div>
            </div>

            <footer class="bg-dark text-light py-4">
                <div class="container">
                    <div class="row">
                        <div class="col-md-6">
                            <h5>Authors</h5>
                            <ul>
                                <li>Anh Nhat Le</li>
                                <li>Khoi Pham</li>
                            </ul>
                        </div>
                        <div class="col-md-6">
                            <h5>Contact Information</h5>
                            <ul>
                                <li>Email: lan0908@iastate.edu (Nhat)</li>
                                <li>Email: duckhoi@iastate.edu (Khoi)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}