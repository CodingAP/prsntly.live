import 'package:frontend/app/app.router.dart';
import 'package:frontend/app/app.locator.dart';
import 'package:frontend/app/app.dialogs.dart';
import 'package:frontend/services/presentation_service.dart';
import 'package:frontend/ui/views/join_presentation/join_presentation_view.form.dart';
import 'package:stacked/stacked.dart';
import 'package:stacked_services/stacked_services.dart';

class JoinPresentationViewModel extends FormViewModel {
  final _navigationService = locator<NavigationService>();
  final _dialogService = locator<DialogService>();
  final _presentationService = locator<PresentationService>();

  Future tryToJoin() async {
    if (hasCode) {
      var exists =
          await runBusyFuture(_presentationService.validateCode(codeValue!));

      if (exists) {
        _navigationService.navigateToPresentationView(code: codeValue!);
      } else {
        _dialogService.showCustomDialog(
          variant: DialogType.infoAlert,
          title: 'Unknown Presentation Code!',
          description: 'Cannot find presentation with code $codeValue',
        );
      }
    }
  }
}
