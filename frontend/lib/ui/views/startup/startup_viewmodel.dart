import 'package:stacked/stacked.dart';
import 'package:frontend/app/app.locator.dart';
import 'package:frontend/app/app.router.dart';
import 'package:stacked_services/stacked_services.dart';

class StartupViewModel extends BaseViewModel {
  final _navigationService = locator<NavigationService>();

  Future runStartupLogic() async {
    _navigationService.replaceWithJoinPresentationView();
  }
}
