"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Siren, Lightbulb } from "lucide-react";

const PublicHome = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-gray-50 mb-6 leading-tight">
          Welcome to the Criminal Record Tracking System
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
          Your trusted platform for public safety and information. Report incidents, view alerts, and stay informed.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link to="/public/report-sighting">
            <Button size="lg" className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white">
              Report a Sighting
            </Button>
          </Link>
          <Link to="/public/alerts">
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary text-primary hover:bg-primary/10">
              View Public Alerts
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center space-x-4">
            <Siren className="h-8 w-8 text-red-500" />
            <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-50">Stay Informed</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 dark:text-gray-300">
            Access public alerts and information about criminal activities in your area. Knowledge is your best defense.
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center space-x-4">
            <ShieldCheck className="h-8 w-8 text-green-500" />
            <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-50">Report Incidents</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 dark:text-gray-300">
            Anonymously report criminal sightings or suspicious activities to help law enforcement keep our communities safe.
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center space-x-4">
            <Lightbulb className="h-8 w-8 text-yellow-500" />
            <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-50">Community Safety</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 dark:text-gray-300">
            Learn about crime prevention tips and how you can contribute to a safer environment for everyone.
          </CardContent>
        </Card>
      </div>


    </div>
  );
};

export default PublicHome;