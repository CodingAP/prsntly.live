import 'package:frontend/ui/bottom_sheets/notice/notice_sheet.dart';
import 'package:frontend/ui/dialogs/info_alert/info_alert_dialog.dart';
import 'package:frontend/ui/views/home/home_view.dart';
import 'package:frontend/ui/views/startup/startup_view.dart';
import 'package:stacked/stacked_annotations.dart';
import 'package:stacked_services/stacked_services.dart';
import 'package:frontend/services/presentation_service.dart';
import 'package:frontend/ui/views/join_presentation/join_presentation_view.dart';
import 'package:frontend/ui/views/presentation/presentation_view.dart';
// @stacked-import

@StackedApp(
  logger: StackedLogger(),
  routes: [
    MaterialRoute(page: HomeView),
    MaterialRoute(page: StartupView),
    MaterialRoute(page: JoinPresentationView),
    MaterialRoute(page: PresentationView),
// @stacked-route
  ],
  dependencies: [
    LazySingleton(classType: BottomSheetService),
    LazySingleton(classType: DialogService),
    LazySingleton(classType: NavigationService),
    LazySingleton(classType: PresentationService),
// @stacked-service
  ],
  bottomsheets: [
    StackedBottomsheet(classType: NoticeSheet),
    // @stacked-bottom-sheet
  ],
  dialogs: [
    StackedDialog(classType: InfoAlertDialog),
    // @stacked-dialog
  ],
)
class App {}
