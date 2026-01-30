import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { setShowUpdateDialog } from "@/store/auth/versionSlice";
import useAppLogout from "@/utils/logout";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const VersionCheck = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(false);
  const Logout = useAppLogout();
  const [retryPopup, setRetryPopup] = useState(false);
  const isDialogOpen = useSelector((state) => state.version.showUpdateDialog);
  console.log(isDialogOpen, "isDialogOpen");
  const serverVersion = useSelector((state) => state?.version?.version);
  const handleCloseDialog = () => {
    dispatch(
      setShowUpdateDialog({
        showUpdateDialog: false,
        version: serverVersion,
      }),
    );
  };
  const handleLogout = async () => {
    setLoading(true);

    try {
      await new Promise((res) => setTimeout(res, 1000));
      await Logout();
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (retryPopup) {
      const timeout = setTimeout(() => {
        dispatch(
          setShowUpdateDialog({
            showUpdateDialog: true,
            version: serverVersion,
          }),
        );
        setRetryPopup(false);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [retryPopup]);

  if (!token) return null;

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
      <DialogContent
        className="max-w-md p-6 rounded-2xl shadow-2xl border bg-gradient-to-br from-white to-gray-100 dark:from-zinc-900 dark:to-zinc-800 [&>button.absolute]:hidden"
        aria-describedby={undefined}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        hideClose={true}
      >
        <DialogHeader className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/25 text-primary mb-3">
            <RefreshCw className="w-6 h-6 animate-spin-slow" />
          </div>
          <DialogTitle className="text-xl font-semibold">
            Update Available
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            A new version of the panel is ready. Update now to version{" "}
            <span className="font-medium text-primary">{serverVersion}</span>.
          </p>
        </DialogHeader>

        <DialogFooter className="mt-6 flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => {
              handleCloseDialog();
              setRetryPopup(true);
            }}
          >
            Do It Later
          </Button>
          <Button onClick={handleLogout} disable={loading}>
            {loading ? "Updating" : "Update Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VersionCheck;
