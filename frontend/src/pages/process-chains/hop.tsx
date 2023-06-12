import DashboardFrame from "@/common/components/Dashboard/DashboardFrame";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Router from "next/router";

type FormValues = {
  dagName: string;
  dagID: string;
  dagPath: string;
  scheduleInterval: string;
  parquetPath: string;
  dataSource: string;
};

export default function ProcessChains() {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const onSubmit = handleSubmit((data) => {
    const dagData = {
      dag_name: data?.dagName,
      dag_id: data?.dagID,
      path: data?.dagPath,
      schedule_interval: data?.scheduleInterval,
      parquet_path: data?.parquetPath,
      data_source_name: data?.dataSource,
    };
    axios
      .post("http://localhost:/api/airflow/", dagData, {
        auth: {
          username: "admin",
          password: "back@123",
        },
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    console.log(data);
    setOpen(false);
  });

  const handleBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(!open);
  };
  return (
    <DashboardFrame title="Hop Process Chains" back onBackPress={() => {
      Router.back()
    }}>
      <iframe src={process.env.NEXT_HOP_UI} />
    </DashboardFrame>
  );
}