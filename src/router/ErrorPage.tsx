import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ErrorPage() {
  useEffect(() => {
    window.location.reload();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-red-100 p-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-center text-xl font-semibold">
            An Error Has Occurred
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center text-gray-600">
          <p>
            We apologize for the inconvenience. Something went wrong while
            processing your request.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full" onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
