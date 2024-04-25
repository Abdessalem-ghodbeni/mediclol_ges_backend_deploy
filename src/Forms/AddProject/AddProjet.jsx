import React, { useEffect, useState } from "react";
import { Steps, Button, message, Form, Input } from "antd";
import InformationPrincipale from "./StepsAddProject/InformationPrincipale";
import InformationsComplementaires from "./StepsAddProject/InformationsComplementaires";
import FomulairesCollecte from "./StepsAddProject/FomulairesCollecte";
import { PlusOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import axios from "axios";
import Swal from "sweetalert2";
import { base_url } from "../../baseUrl";
import { useNavigate } from "react-router-dom";
const { Step } = Steps;
function AddProjet({ onFinish }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [projectData, setProjectData] = useState(
    sessionStorage.getItem("globalData")
      ? JSON.parse(sessionStorage.getItem("globalData"))
      : null
  );
  const [importSwitch, setImportSwitch] = useState(false);

  const navigate = useNavigate();
  const handleImportSwitchChange = (checked) => {
    setImportSwitch(checked);
  };
  const handleNext = (data) => {
    setCurrentStep(currentStep + 1);
    setProjectData(data);
    const prevData = JSON.parse(sessionStorage.getItem("globalData"));
    const newData = {
      ...prevData,
      ...data,
    };
    setProjectData(newData);

    sessionStorage.setItem("globalData", JSON.stringify(newData));
    console.log("slouma ya chbeb", data);
  };
  useEffect(() => {
    console.log("aaa", importSwitch);
  }, [importSwitch]);
  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleFinish = () => {
    message.success("Formulaire soumis avec succès!");
    const accessToken = localStorage.getItem("accessToken");
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const userId = localStorage.getItem("USER_ID");
    console.log("Données finales :", projectData);
    axios
      .post(`${base_url}/project/add`, { ...projectData, userId }, axiosConfig)
      .then((response) => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your work has been saved",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/internaute/liste");
      })
      .catch((error) => {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong while updating.",
        });
      });
  };
  // const handleFinish = () => {
  //   // message.success("Formulaire soumis avec succès!");
  //   const accessToken = localStorage.getItem("accessToken");
  //   const axiosConfig = {
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`,
  //     },
  //   };
  //   const userId = localStorage.getItem("USER_ID");
  //   console.log("Données finales :", projectData);
  //   onFinish();
  //   axios
  //     .post(`${base_url}/project/add`, { ...projectData, userId }, axiosConfig)
  //     .then((response) => {
  //       Swal.fire({
  //         position: "top-end",
  //         icon: "success",
  //         title: "Your work has been saved",
  //         showConfirmButton: false,
  //         timer: 1500,
  //       });
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       Swal.fire({
  //         icon: "error",
  //         title: "Oops...",
  //         text: "Something went wrong while updating.",
  //       });
  //     });
  // };

  const steps = [
    {
      title: "Information Principale",
      content: (
        <InformationPrincipale onNext={handleNext} projectData={projectData} />
      ),
    },
    {
      title: "Informations Complémentaires",
      content: (
        <InformationsComplementaires
          onNext={handleNext}
          projectData={projectData}
        />
      ),
    },
    {
      title: "Fomulaire",
      content: (
        <FomulairesCollecte
          importSwitch={importSwitch}
          onImportSwitchChange={handleImportSwitchChange}
          onNext={handleNext}
          projectData={projectData}
        />
      ),
    },
    // ...(importSwitch
    //   ? import { base_url } from './../../baseUrl';

    //   : [
    //       {
    //         title: "Affectation",
    //         content: (
    //           <div>
    //             <h3>Contenu de l'étape 4</h3>
    //           </div>
    //         ),
    //       },
    //     ]),
    {
      title: "Étape ",
      content: (
        <div className="text-center mt-5">
          <img
            src="assets/images/suc.jpeg"
            alt=""
            className="img-fluid w-50 "
          />
        </div>
      ),
    },
  ];

  return (
    <div className="my-5 mb-5">
      <div className="container vstack gap-4 mb-5 mt-5">
        <div className="row mb-5 card rounded-3 border p-4 pb-2">
          <div className="col-12 mb-5 mt-3">
            <h1 className="fs-4 mb-0">
              {/* <UnorderedListOutlined className="mx-3" />     */}
              <PlusOutlined className="mx-3" />
              Ajouter Projet
            </h1>
            <p className="text-center text-justify mt-5">
              <strong>
                "La création d'un projet, c'est comme tisser une toile complexe
                : chaque formulaire est un fil essentiel, tissant ensemble les
                détails pour créer une œuvre complète et fonctionnelle."
              </strong>
            </p>
          </div>
          <div>
            <Steps current={currentStep}>
              {steps.map((step, index) => (
                <Step key={index} title={step.title} />
              ))}
            </Steps>
            <div className="steps-content">{steps[currentStep].content}</div>
            <div className="steps-action mb-5 d-flex justify-content-around">
              {currentStep > 0 && (
                <Button
                  style={{ margin: "0 8px" }}
                  onClick={handlePrev}
                  className="d-flex justify-content-center align-items-center "
                >
                  <ArrowLeftOutlined /> Précédent
                </Button>
              )}
              {/* {currentStep < steps.length - 1 && (
                <Button type="primary" onClick={handleNext}>
                  Suivant
                </Button>
              )} */}

              {currentStep === steps.length - 1 && (
                <Button type="submit" onClick={handleFinish}>
                  Soumettre
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProjet;
