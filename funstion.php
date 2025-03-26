// Agency Dashboard API Fonksiyonları - Bu kodu functions.php dosyanıza ekleyin

// REST API'yi kaydet
add_action('rest_api_init', function () {
    
    // 1. İş Listesi Endpoint'i
    register_rest_route('agency/v1', '/jobs', array(
        'methods' => 'GET',
        'callback' => 'get_agency_jobs',
        'permission_callback' => 'check_agency_permission',
    ));
    
    // 2. Yeni İş Oluşturma Endpoint'i
    register_rest_route('agency/v1', '/jobs/create', array(
        'methods' => 'POST',
        'callback' => 'create_agency_job',
        'permission_callback' => 'check_agency_permission',
    ));
    
    // 3. İş Düzenleme Endpoint'i
    register_rest_route('agency/v1', '/jobs/update/(?P<id>\d+)', array(
        'methods' => 'POST',
        'callback' => 'update_agency_job',
        'permission_callback' => 'check_agency_permission',
    ));
    
    // 4. İş Silme Talebi Endpoint'i
    register_rest_route('agency/v1', '/jobs/delete/(?P<id>\d+)', array(
        'methods' => 'DELETE',
        'callback' => 'delete_agency_job',
        'permission_callback' => 'check_agency_permission',
    ));
    
    // 5. Mesajları Getirme Endpoint'i
    register_rest_route('agency/v1', '/messages', array(
        'methods' => 'GET',
        'callback' => 'get_agency_messages',
        'permission_callback' => 'check_agency_permission',
    ));
    
    // 6. Mesaj Okundu İşaretleme Endpoint'i
    register_rest_route('agency/v1', '/messages/read/(?P<id>\d+)', array(
        'methods' => 'POST',
        'callback' => 'mark_message_as_read_api',
        'permission_callback' => 'check_agency_permission',
    ));
    
    // 7. Kullanıcı Bilgilerini Getirme Endpoint'i
    register_rest_route('agency/v1', '/user/profile', array(
        'methods' => 'GET',
        'callback' => 'get_agency_user_profile',
        'permission_callback' => 'check_agency_permission',
    ));
    
    // 8. Kullanıcı Bilgilerini Güncelleme Endpoint'i
    register_rest_route('agency/v1', '/user/update', array(
        'methods' => 'POST',
        'callback' => 'update_agency_user',
        'permission_callback' => 'check_agency_permission',
    ));
    
    // 9. Acenta ve Otel Bilgilerini Getirme Endpoint'i
    register_rest_route('agency/v1', '/options', array(
        'methods' => 'GET',
        'callback' => 'get_agency_options',
        'permission_callback' => 'check_agency_permission',
    ));
});

// İzin kontrolü fonksiyonu
function check_agency_permission($request) {
    // Burada mevcut WordPress kullanıcısının partner rolüne sahip olup olmadığını kontrol ediyoruz
    // Bu örnek, kullanıcının zaten WordPress'te giriş yapmış olduğunu varsayar
    
    // Oturum kontrolü
    if (!is_user_logged_in()) {
        return new WP_Error('rest_unauthorized', 'Lütfen giriş yapın', array('status' => 401));
    }
    
    $user = wp_get_current_user();
    
    // Partner rolü kontrolü
    if (!in_array('partner', $user->roles) && !in_array('administrator', $user->roles)) {
        return new WP_Error('rest_forbidden', 'Bu sayfaya erişim yetkiniz yok', array('status' => 403));
    }
    
    return true;
}

// 1. İş Listesi API
function get_agency_jobs($request) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'jobs';
    
    $current_user_id = get_current_user_id();
    $current_user_agency = get_user_meta($current_user_id, 'agency', true);
    
    // Kullanıcının kendi oluşturduğu işler
    $user_jobs = $wpdb->get_results($wpdb->prepare("SELECT * FROM $table_name WHERE partner_id = %d", $current_user_id));
    
    // Tüm işleri al
    $all_jobs = $wpdb->get_results("SELECT * FROM $table_name");
    
    // delete_request değerlerini düzelt
    foreach ($user_jobs as $job) {
        // delete_request değeri boş, null veya geçersizse 0 yap
        if ($job->delete_request === null || $job->delete_request === '' || !isset($job->delete_request)) {
            // Veritabanını güncelle
            $wpdb->update(
                $table_name,
                array('delete_request' => 0),
                array('id' => $job->id)
            );
            
            // Mevcut objeyi de güncelle
            $job->delete_request = 0;
        }
        
        // integer olarak dönüştür
        $job->delete_request = intval($job->delete_request);
    }
    
    // Aynı acentadaki diğer kullanıcıların oluşturduğu işler
    $agency_jobs = array();
    foreach ($all_jobs as $job) {
        $creator_agency = get_user_meta($job->partner_id, 'agency', true);
        if ($creator_agency == $current_user_agency && $job->partner_id != $current_user_id) {
            // delete_request değeri boş, null veya geçersizse 0 yap
            if ($job->delete_request === null || $job->delete_request === '' || !isset($job->delete_request)) {
                // Veritabanını güncelle
                $wpdb->update(
                    $table_name,
                    array('delete_request' => 0),
                    array('id' => $job->id)
                );
                
                // Mevcut objeyi de güncelle
                $job->delete_request = 0;
            }
            
            // integer olarak dönüştür
            $job->delete_request = intval($job->delete_request);
            
            // Host sayılarını ekle
            $job->host_counts = get_host_counts_for_job($job->id);
            $job->creator_name = get_userdata($job->partner_id)->display_name;
            $agency_jobs[] = $job;
        }
    }
    
    // Host sayılarını kullanıcının kendi işlerine ekle
    foreach ($user_jobs as $job) {
        $job->host_counts = get_host_counts_for_job($job->id);
    }
    
    return array(
        'user_jobs' => $user_jobs,
        'agency_jobs' => $agency_jobs
    );
}

// Host sayılarını getir yardımcı fonksiyon
function get_host_counts_for_job($job_id) {
    global $wpdb;
    $counts_table = $wpdb->prefix . 'job_host_counts';
    
    // Veritabanından host sayılarını al
    $counts = $wpdb->get_results($wpdb->prepare(
        "SELECT * FROM $counts_table WHERE job_id = %d ORDER BY STR_TO_DATE(date, '%d/%m/%Y')",
        $job_id
    ));
    
    // Host sayıları bulunamadıysa boş dizi döndür
    if (!$counts || empty($counts)) {
        return array();
    }
    
    // Her bir host verisi için sayıları integer'a dönüştür
    foreach ($counts as &$count) {
        $count->male_hosts = intval($count->male_hosts);
        $count->female_hosts = intval($count->female_hosts);
        
        // Toplam host sayısını ekle
        $count->total_hosts = $count->male_hosts + $count->female_hosts;
    }
    
    return $counts;
}

// 2. Yeni İş Oluşturma API
function create_agency_job($request) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'jobs';
    $host_table = $wpdb->prefix . 'job_host_counts';
    
    // Tablo yapısını kontrol et ve düzelt - veritabanı şemasındaki 0000-00-00 varsayılan değeri sorununu çözüm
    fix_job_table_date_defaults($wpdb, $table_name);
    
    // JSON olarak gönderilen parametreleri al
    $params = json_decode($request->get_body(), true);
    
    // JSON parse hatası kontrolü
    if (json_last_error() !== JSON_ERROR_NONE) {
        // Standart form verilerini kontrol et
        $params = $request->get_params();
    }
    
    $current_user_id = get_current_user_id();
    
    // Gerekli alan kontrolü
    $required_fields = array('group_name', 'start_date', 'end_date', 'hotel_name', 'accommodation', 'male_outfit', 'female_outfit');
    
    foreach ($required_fields as $field) {
        if (!isset($params[$field]) || empty($params[$field])) {
            return new WP_Error('missing_field', $field . ' alanı eksik veya boş', array('status' => 400));
        }
    }
    
    // Host sayıları kontrolü
    $male_hosts = isset($params['male_hosts']) ? intval($params['male_hosts']) : 0;
    $female_hosts = isset($params['female_hosts']) ? intval($params['female_hosts']) : 0;
    
    // Tarih formatı kontrolü ve dönüşümü
    error_log('Gelen tarih formatları - Başlangıç: ' . $params['start_date'] . ', Bitiş: ' . $params['end_date']);
    
    // Tarihlerin varsayılan değerleri
    $start_date = sanitize_text_field($params['start_date']);
    $end_date = sanitize_text_field($params['end_date']);
    
    // Gelen tarih, 0000-00-00 formatındaysa otomatik düzelt ve log'a yaz
    if ($start_date === '0000-00-00') {
        error_log('Geçersiz tarih formatı - 0000-00-00 formatında başlangıç tarihi, otomatik düzeltiliyor.');
        $start_date = date('d/m/Y'); // Bugünün tarihi
    }
    
    if ($end_date === '0000-00-00') {
        error_log('Geçersiz tarih formatı - 0000-00-00 formatında bitiş tarihi, otomatik düzeltiliyor.');
        $end_date = date('d/m/Y', strtotime('+1 day')); // Yarının tarihi
    }
    
    // YYYY-MM-DD formatını DD/MM/YYYY formatına çevir
    if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $start_date)) {
        error_log('Başlangıç tarihi YYYY-MM-DD formatından dönüştürülüyor: ' . $start_date);
        $date_parts = explode('-', $start_date);
        $start_date = $date_parts[2] . '/' . $date_parts[1] . '/' . $date_parts[0];
    }
    
    if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $end_date)) {
        error_log('Bitiş tarihi YYYY-MM-DD formatından dönüştürülüyor: ' . $end_date);
        $date_parts = explode('-', $end_date);
        $end_date = $date_parts[2] . '/' . $date_parts[1] . '/' . $date_parts[0];
    }
    
    // GG/AA/YYYY formatı kontrolü
    $date_regex = '/^\d{2}\/\d{2}\/\d{4}$/';
    if (!preg_match($date_regex, $start_date) || !preg_match($date_regex, $end_date)) {
        error_log('Geçersiz tarih formatı - Başlangıç: ' . $start_date . ', Bitiş: ' . $end_date);
        error_log('Formatlar düzeltiliyor...');
        
        // Eğer başlangıç tarihi GG/AA/YYYY formatında değilse, bugünün tarihini kullan
        if (!preg_match($date_regex, $start_date)) {
            $start_date = date('d/m/Y');
        }
        
        // Eğer bitiş tarihi GG/AA/YYYY formatında değilse, yarının tarihini kullan
        if (!preg_match($date_regex, $end_date)) {
            $end_date = date('d/m/Y', strtotime('+1 day'));
        }
    }
    
    // Tarihlerin geçerli olup olmadığını kontrol et
    try {
        $start_date_parts = explode('/', $start_date);
        $end_date_parts = explode('/', $end_date);
        
        // Tarih parçalarının geçerli olup olmadığını kontrol et
        if (!checkdate(intval($start_date_parts[1]), intval($start_date_parts[0]), intval($start_date_parts[2])) ||
            !checkdate(intval($end_date_parts[1]), intval($end_date_parts[0]), intval($end_date_parts[2]))) {
            error_log('Geçersiz tarih değeri, düzeltiliyor...');
            
            // Eğer tarihler geçersizse, bugün ve yarının tarihlerini kullan
            $start_date = date('d/m/Y');
            $end_date = date('d/m/Y', strtotime('+1 day'));
        } else {
            // Tarihleri DateTime nesnelerine dönüştür
            $start_date_obj = new DateTime($start_date_parts[2] . '-' . $start_date_parts[1] . '-' . $start_date_parts[0]);
            $end_date_obj = new DateTime($end_date_parts[2] . '-' . $end_date_parts[1] . '-' . $end_date_parts[0]);
            
            // Eğer başlangıç tarihi bitiş tarihinden sonra ise, düzelt
            if ($start_date_obj > $end_date_obj) {
                error_log('Başlangıç tarihi bitiş tarihinden sonra, düzeltiliyor...');
                $start_date = date('d/m/Y');
                $end_date = date('d/m/Y', strtotime('+1 day'));
            }
        }
    } catch (Exception $e) {
        error_log('Tarih doğrulama hatası: ' . $e->getMessage());
        // Hata durumunda varsayılan değerleri kullan
        $start_date = date('d/m/Y');
        $end_date = date('d/m/Y', strtotime('+1 day'));
    }
    
    error_log('Son tarih değerleri - Başlangıç: ' . $start_date . ', Bitiş: ' . $end_date);
    
    // Veri tabanı işlemini başlat (atomik işlem için)
    $wpdb->query('START TRANSACTION');
    
    try {
        // İş kaydını oluşturmadan önce tarih formatını son kez kontrol et
        // DB'ye geçersiz tarih gitmesini kesinlikle önle
        if ($start_date === '0000-00-00' || $end_date === '0000-00-00' || 
            !preg_match('/^\d{2}\/\d{2}\/\d{4}$/', $start_date) || 
            !preg_match('/^\d{2}\/\d{2}\/\d{4}$/', $end_date)) {
            
            error_log('İş oluşturma öncesi son kontrol - Geçersiz tarih formatı düzeltiliyor: ' . $start_date . ', ' . $end_date);
            
            // Kesinlikle bugünün ve yarının tarihini kullan, 0000-00-00 kaydetmeyi engelle
            $start_date = date('d/m/Y');
            $end_date = date('d/m/Y', strtotime('+1 day'));
        }
        
        error_log('Veritabanına kaydedilecek tarihler: Başlangıç=' . $start_date . ', Bitiş=' . $end_date);
        
        // İş kaydını oluştur
        $insert_result = $wpdb->insert(
            $table_name,
            array(
                'partner_id' => $current_user_id,
                'group_name' => sanitize_text_field($params['group_name']),
                'note' => isset($params['note']) ? sanitize_text_field($params['note']) : '',
                'start_date' => $start_date,
                'end_date' => $end_date,
                'hotel_name' => sanitize_text_field($params['hotel_name']),
                'accommodation' => sanitize_text_field($params['accommodation']),
                'male_outfit' => sanitize_text_field($params['male_outfit']),
                'female_outfit' => sanitize_text_field($params['female_outfit']),
                'male_hosts' => $male_hosts,
                'female_hosts' => $female_hosts,
                'status' => 'Yeni İş',
                'delete_request' => 0
            )
        );
        
        // Insert işlemini kontrol et
        if ($insert_result === false) {
            error_log('İş veritabanına kaydedilemedi: ' . $wpdb->last_error);
            throw new Exception('İş veritabanına kaydedilemedi: ' . $wpdb->last_error);
        }
        
        // Eklenen kaydı doğrula
        $job_id = $wpdb->insert_id;
        $inserted_job = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_name WHERE id = %d", $job_id));
        
        // Eklenen kayıtta tarih değerlerini kontrol et
        if ($inserted_job->start_date === '0000-00-00' || $inserted_job->end_date === '0000-00-00') {
            error_log('Veritabanına kaydedildi ancak tarihler 0000-00-00 olarak gözüküyor. Düzeltme uygulanıyor...');
            
            // Tarihleri强制 güncelle
            $wpdb->update(
                $table_name,
                array(
                    'start_date' => $start_date,
                    'end_date' => $end_date
                ),
                array('id' => $job_id)
            );
        }
        
        // Host sayılarını kaydet
        try {
            // Tarih aralığını oluştur
            $start_date_parts = explode('/', $start_date);
            $end_date_parts = explode('/', $end_date);
            
            // DateTime nesnelerini oluştur
            $start_date_obj = new DateTime($start_date_parts[2] . '-' . $start_date_parts[1] . '-' . $start_date_parts[0]);
            $end_date_obj = new DateTime($end_date_parts[2] . '-' . $end_date_parts[1] . '-' . $end_date_parts[0]);
            
            // DatePeriod nesnesi oluştur
            $interval = new DateInterval('P1D');
            $date_range = new DatePeriod($start_date_obj, $interval, $end_date_obj->modify('+1 day'));
            
            foreach ($date_range as $date) {
                $formatted_date = $date->format('d/m/Y');
                
                $host_insert = $wpdb->insert(
                    $host_table,
                    array(
                        'job_id' => $job_id,
                        'date' => $formatted_date,
                        'male_hosts' => $male_hosts,
                        'female_hosts' => $female_hosts
                    )
                );
                
                if ($host_insert === false) {
                    throw new Exception('Host sayıları kaydedilemedi: ' . $wpdb->last_error);
                }
            }
        } catch (Exception $e) {
            error_log('Host sayıları kaydedilirken hata: ' . $e->getMessage());
            throw $e;
        }
        
        // Tüm işlemler başarılı ise commit
        $wpdb->query('COMMIT');
        
        return array(
            'success' => true,
            'job_id' => $job_id,
            'message' => 'İş başarıyla oluşturuldu'
        );
    } catch (Exception $e) {
        // Hata olursa rollback
        $wpdb->query('ROLLBACK');
        
        error_log('İş oluşturma hatası: ' . $e->getMessage());
        
        return new WP_Error(
            'create_job_failed', 
            'İş oluşturma işlemi başarısız: ' . $e->getMessage(), 
            array('status' => 500)
        );
    }
}

// Tablo yapısını düzeltmek için yardımcı fonksiyon
function fix_job_table_date_defaults($wpdb, $table_name) {
    // Tablo yapısını kontrol et
    error_log('Tablo yapısı kontrolü: ' . $table_name);
    $table_structure = $wpdb->get_results("DESCRIBE $table_name");
    
    $date_columns = array('start_date', 'end_date');
    $needs_fixing = false;
    
    // Tarih sütunlarını kontrol et
    foreach ($table_structure as $column) {
        if (in_array($column->Field, $date_columns)) {
            error_log($column->Field . ' sütunu yapısı: Default=' . $column->Default . ', Type=' . $column->Type);
            
            // Eğer varsayılan değer 0000-00-00 ise veya tarih tipi DATE ise düzeltilmesi gerekiyor
            if ($column->Default === '0000-00-00' || strpos($column->Type, 'date') !== false) {
                $needs_fixing = true;
                error_log($column->Field . ' sütunu için düzeltme gerekiyor');
            }
        }
    }
    
    // Düzeltme gerekiyorsa sütunları güncelle
    if ($needs_fixing) {
        error_log('Tarih sütunları yapılandırması düzeltiliyor...');
        
        try {
            // Varsayılan değerleri NULL olarak ayarla ve veri tipini VARCHAR olarak değiştir
            $wpdb->query("ALTER TABLE $table_name MODIFY COLUMN start_date VARCHAR(20) NULL DEFAULT NULL");
            $wpdb->query("ALTER TABLE $table_name MODIFY COLUMN end_date VARCHAR(20) NULL DEFAULT NULL");
            
            error_log('Tablo yapısı başarıyla güncellendi');
        } catch (Exception $e) {
            error_log('Tablo yapısı güncelleme hatası: ' . $e->getMessage());
        }
    }
}

// 3. İş Düzenleme API
function update_agency_job($request) {
    global $wpdb;
    $job_id = $request->get_param('id');
    $table_name = $wpdb->prefix . 'jobs';
    $host_table = $wpdb->prefix . 'job_host_counts';
    
    // Tablo yapısını kontrol et ve düzelt
    fix_job_table_date_defaults($wpdb, $table_name);
    
    // JSON olarak gönderilen parametreleri al
    $params = json_decode($request->get_body(), true);
    
    // JSON parse hatası kontrolü
    if (json_last_error() !== JSON_ERROR_NONE) {
        // Standart form verilerini kontrol et
        $params = $request->get_params();
    }
    
    $current_user_id = get_current_user_id();
    
    // İşin mevcut olduğunu ve bu kullanıcıya ait olduğunu kontrol et
    $job = $wpdb->get_row($wpdb->prepare(
        "SELECT * FROM $table_name WHERE id = %d AND partner_id = %d",
        $job_id, $current_user_id
    ));
    
    if (!$job) {
        // İş bulunamadıysa veya kullanıcıya doğrudan ait değilse,
        // aynı acentaya ait olup olmadığını kontrol et
        // Bu, düzenleme talebi onaylandıktan sonra da düzenleme yapılabilmesini sağlar
        
        $current_user_agency = get_user_meta($current_user_id, 'agency', true);
        
        // İşi al
        $job = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $table_name WHERE id = %d",
            $job_id
        ));
        
        if (!$job) {
            return new WP_Error('invalid_job', 'İş bulunamadı', array('status' => 404));
        }
        
        // İş sahibinin acentasını kontrol et
        $job_owner_agency = get_user_meta($job->partner_id, 'agency', true);
        
        // Eğer aynı acentada değilse, düzenleme yetkisi yok
        if ($current_user_agency != $job_owner_agency) {
            return new WP_Error('invalid_job', 'Bu işi düzenleme yetkiniz yok', array('status' => 403));
        }
        
        // Buraya gelinirse, kullanıcı işin sahibiyle aynı acentada demektir
        error_log("Düzenleme: Kullanıcı " . $current_user_id . " aynı acenta içinde " . $job_id . " ID'li işi düzenleyebilir");
    }
    
    // Düzenleme taleplerinin durumunu kontrol et
    // İşin son düzenleme talebinin durumunu kontrol et
    $edit_request_table = $wpdb->prefix . 'job_edit_requests';
    $last_edit_request = $wpdb->get_row($wpdb->prepare(
        "SELECT * FROM $edit_request_table WHERE job_id = %d ORDER BY id DESC LIMIT 1",
        $job_id
    ));
    
    // Eğer bekleyen bir düzenleme talebi varsa, kullanıcıyı bilgilendir
    if ($last_edit_request && $last_edit_request->status == 'pending') {
        error_log("Düzenleme: İş için bekleyen bir düzenleme talebi var, kullanıcı bilgilendiriliyor.");
        // Bu bir hata değil, kullanıcı işi düzenlemeye devam edebilir
    }
    
    // Male ve female host sayılarını al
    $male_hosts = isset($params['male_hosts']) ? intval($params['male_hosts']) : $job->male_hosts;
    $female_hosts = isset($params['female_hosts']) ? intval($params['female_hosts']) : $job->female_hosts;
    
    // Veritabanı işlemini başlat (atomik işlem için)
    $wpdb->query('START TRANSACTION');
    
    try {
        // İş bilgilerini güncelle
        $update_data = array();
        
        if (isset($params['group_name']) && !empty($params['group_name'])) {
            $update_data['group_name'] = sanitize_text_field($params['group_name']);
        }
        
        if (isset($params['note'])) {
            $update_data['note'] = sanitize_text_field($params['note']);
        }
        
        // Tarih değerlerini işleme
        if (isset($params['start_date']) && !empty($params['start_date'])) {
            $start_date = sanitize_text_field($params['start_date']);
            
            // 0000-00-00 formatını kontrol et
            if ($start_date === '0000-00-00') {
                error_log('Güncelleme: Geçersiz başlangıç tarihi (0000-00-00), bugünün tarihi kullanılıyor.');
                $start_date = date('d/m/Y');
            }
            
            // YYYY-MM-DD formatını DD/MM/YYYY formatına dönüştür
            if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $start_date)) {
                $date_parts = explode('-', $start_date);
                $start_date = $date_parts[2] . '/' . $date_parts[1] . '/' . $date_parts[0];
            }
            
            // GG/AA/YYYY formatı kontrolü
            if (!preg_match('/^\d{2}\/\d{2}\/\d{4}$/', $start_date)) {
                error_log('Güncelleme: Geçersiz başlangıç tarihi formatı, bugünün tarihi kullanılıyor.');
                $start_date = date('d/m/Y');
            }
            
            $update_data['start_date'] = $start_date;
        }
        
        if (isset($params['end_date']) && !empty($params['end_date'])) {
            $end_date = sanitize_text_field($params['end_date']);
            
            // 0000-00-00 formatını kontrol et
            if ($end_date === '0000-00-00') {
                error_log('Güncelleme: Geçersiz bitiş tarihi (0000-00-00), yarının tarihi kullanılıyor.');
                $end_date = date('d/m/Y', strtotime('+1 day'));
            }
            
            // YYYY-MM-DD formatını DD/MM/YYYY formatına dönüştür
            if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $end_date)) {
                $date_parts = explode('-', $end_date);
                $end_date = $date_parts[2] . '/' . $date_parts[1] . '/' . $date_parts[0];
            }
            
            // GG/AA/YYYY formatı kontrolü
            if (!preg_match('/^\d{2}\/\d{2}\/\d{4}$/', $end_date)) {
                error_log('Güncelleme: Geçersiz bitiş tarihi formatı, yarının tarihi kullanılıyor.');
                $end_date = date('d/m/Y', strtotime('+1 day'));
            }
            
            $update_data['end_date'] = $end_date;
        }
        
        if (isset($params['hotel_name']) && !empty($params['hotel_name'])) {
            $update_data['hotel_name'] = sanitize_text_field($params['hotel_name']);
        }
        
        if (isset($params['accommodation']) && !empty($params['accommodation'])) {
            $update_data['accommodation'] = sanitize_text_field($params['accommodation']);
        }
        
        if (isset($params['male_outfit']) && !empty($params['male_outfit'])) {
            $update_data['male_outfit'] = sanitize_text_field($params['male_outfit']);
        }
        
        if (isset($params['female_outfit']) && !empty($params['female_outfit'])) {
            $update_data['female_outfit'] = sanitize_text_field($params['female_outfit']);
        }
        
        // Host sayılarını güncelle
        if (isset($params['male_hosts'])) {
            $update_data['male_hosts'] = intval($params['male_hosts']);
        }
        
        if (isset($params['female_hosts'])) {
            $update_data['female_hosts'] = intval($params['female_hosts']);
        }
        
        if (!empty($update_data)) {
            $update_result = $wpdb->update($table_name, $update_data, array('id' => $job_id));
            
            if ($update_result === false) {
                throw new Exception('İş güncellenemedi: ' . $wpdb->last_error);
            }
        }
        
        // Düzenleme talebi oluştur
        $edit_request_table = $wpdb->prefix . 'job_edit_requests';
        
        // Tablo var mı kontrol et, yoksa oluştur
        if($wpdb->get_var("SHOW TABLES LIKE '$edit_request_table'") != $edit_request_table) {
            $charset_collate = $wpdb->get_charset_collate();
            $sql = "CREATE TABLE $edit_request_table (
                id mediumint(9) NOT NULL AUTO_INCREMENT,
                job_id mediumint(9) NOT NULL,
                partner_id mediumint(9) NOT NULL,
                group_name varchar(255) NOT NULL,
                start_date varchar(20) NOT NULL,
                end_date varchar(20) NOT NULL,
                hotel_name varchar(255) NOT NULL,
                accommodation varchar(255) NOT NULL,
                male_outfit varchar(255) NOT NULL,
                female_outfit varchar(255) NOT NULL,
                note text,
                status varchar(20) NOT NULL,
                created_at datetime NOT NULL,
                PRIMARY KEY (id)
            ) $charset_collate;";
            
            require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
            dbDelta($sql);
        }
        
        // Tablo yapısını kontrol et ve gerekirse güncelle (eski sürümler için)
        $required_columns = array(
            'job_id' => 'mediumint(9) NOT NULL',
            'partner_id' => 'mediumint(9) NOT NULL',
            'group_name' => 'varchar(255) NOT NULL',
            'start_date' => 'varchar(20) NOT NULL',
            'end_date' => 'varchar(20) NOT NULL',
            'hotel_name' => 'varchar(255) NOT NULL',
            'accommodation' => 'varchar(255) NOT NULL',
            'male_outfit' => 'varchar(255) NOT NULL',
            'female_outfit' => 'varchar(255) NOT NULL',
            'note' => 'text',
            'status' => 'varchar(20) NOT NULL',
            'created_at' => 'datetime NOT NULL'
        );
        
        // Önce tablo var mı kontrol et
        if ($wpdb->get_var("SHOW TABLES LIKE '$edit_request_table'") == $edit_request_table) {
            // Tablo yapısını al
            $table_structure = $wpdb->get_results("DESCRIBE $edit_request_table");
            $existing_columns = array();
            
            foreach ($table_structure as $column) {
                $existing_columns[$column->Field] = true;
            }
            
            // Eksik sütunları ekle
            foreach ($required_columns as $column_name => $column_definition) {
                if (!isset($existing_columns[$column_name])) {
                    error_log("Düzenleme talebi tablosuna '$column_name' sütunu ekleniyor");
                    try {
                        $wpdb->query("ALTER TABLE $edit_request_table ADD COLUMN $column_name $column_definition");
                    } catch (Exception $e) {
                        error_log("Sütun eklenirken hata: " . $e->getMessage());
                    }
                }
            }
            
            // request_data sütunu varsa kaldır (eski sürüm uyumluluğu için)
            if (isset($existing_columns['request_data'])) {
                try {
                    $wpdb->query("ALTER TABLE $edit_request_table DROP COLUMN request_data");
                } catch (Exception $e) {
                    error_log("Sütun kaldırılırken hata: " . $e->getMessage());
                }
            }
        }
        
        // Veri hazırlama
        $group_name = isset($params['group_name']) ? sanitize_text_field($params['group_name']) : $job->group_name;
        
        // Başlangıç tarihini hazırla
        $start_date = isset($params['start_date']) ? sanitize_text_field($params['start_date']) : $job->start_date;
        
        // start_date için format kontrol ve düzeltme
        if ($start_date === '0000-00-00') {
            error_log('Düzenleme talebi: Geçersiz başlangıç tarihi (0000-00-00), bugünün tarihi kullanılıyor.');
            $start_date = date('d/m/Y');
        }
        
        if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $start_date)) {
            $date_parts = explode('-', $start_date);
            $start_date = $date_parts[2] . '/' . $date_parts[1] . '/' . $date_parts[0];
            error_log('Düzenleme talebi: Başlangıç tarihi formata çevrildi: ' . $start_date);
        }
        
        if (!preg_match('/^\d{2}\/\d{2}\/\d{4}$/', $start_date)) {
            error_log('Düzenleme talebi: Geçersiz başlangıç tarihi formatı, bugünün tarihi kullanılıyor: ' . $start_date);
            $start_date = date('d/m/Y');
        }
        
        // Bitiş tarihini hazırla
        $end_date = isset($params['end_date']) ? sanitize_text_field($params['end_date']) : $job->end_date;
        
        // end_date için format kontrol ve düzeltme
        if ($end_date === '0000-00-00') {
            error_log('Düzenleme talebi: Geçersiz bitiş tarihi (0000-00-00), yarının tarihi kullanılıyor.');
            $end_date = date('d/m/Y', strtotime('+1 day'));
        }
        
        if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $end_date)) {
            $date_parts = explode('-', $end_date);
            $end_date = $date_parts[2] . '/' . $date_parts[1] . '/' . $date_parts[0];
            error_log('Düzenleme talebi: Bitiş tarihi formata çevrildi: ' . $end_date);
        }
        
        if (!preg_match('/^\d{2}\/\d{2}\/\d{4}$/', $end_date)) {
            error_log('Düzenleme talebi: Geçersiz bitiş tarihi formatı, yarının tarihi kullanılıyor: ' . $end_date);
            $end_date = date('d/m/Y', strtotime('+1 day'));
        }
        
        $hotel_name = isset($params['hotel_name']) ? sanitize_text_field($params['hotel_name']) : $job->hotel_name;
        $accommodation = isset($params['accommodation']) ? sanitize_text_field($params['accommodation']) : $job->accommodation;
        $male_outfit = isset($params['male_outfit']) ? sanitize_text_field($params['male_outfit']) : $job->male_outfit;
        $female_outfit = isset($params['female_outfit']) ? sanitize_text_field($params['female_outfit']) : $job->female_outfit;
        $note = isset($params['note']) ? sanitize_text_field($params['note']) : $job->note;
        
        // Düzenleme talebi tablosunun tarih sütunlarını düzelt
        fix_job_table_date_defaults($wpdb, $edit_request_table);
        
        // Düzenleme talebini kaydet
        try {
            $current_date = current_time('mysql');
            
            // Sorgulama yaparak hangi alanların bulunduğunu kontrol et
            $columns = $wpdb->get_col("DESCRIBE $edit_request_table");
            $columns_str = implode(', ', $columns);
            error_log("Tablo sütunları: $columns_str");
            
            error_log("Düzenleme talebi için tarih değerleri: start_date=" . $start_date . ", end_date=" . $end_date);
            
            // Dinamik olarak sütun adı ve değer dizileri oluştur
            $insert_data = array();
            if (in_array('job_id', $columns)) $insert_data['job_id'] = $job_id;
            if (in_array('partner_id', $columns)) $insert_data['partner_id'] = $current_user_id;
            if (in_array('group_name', $columns)) $insert_data['group_name'] = $group_name;
            if (in_array('start_date', $columns)) $insert_data['start_date'] = $start_date;
            if (in_array('end_date', $columns)) $insert_data['end_date'] = $end_date;
            if (in_array('hotel_name', $columns)) $insert_data['hotel_name'] = $hotel_name;
            if (in_array('accommodation', $columns)) $insert_data['accommodation'] = $accommodation;
            if (in_array('male_outfit', $columns)) $insert_data['male_outfit'] = $male_outfit;
            if (in_array('female_outfit', $columns)) $insert_data['female_outfit'] = $female_outfit;
            if (in_array('note', $columns)) $insert_data['note'] = $note;
            if (in_array('status', $columns)) $insert_data['status'] = 'pending';
            if (in_array('created_at', $columns)) $insert_data['created_at'] = $current_date;
            
            // İşlem öncesi kaydedilecek verileri log'a yaz
            error_log("Düzenleme talebi için kaydedilecek veriler: " . json_encode($insert_data));
            
            // Verileri gönder
            $edit_request_insert = $wpdb->insert(
                $edit_request_table,
                $insert_data
            );
            
            if ($edit_request_insert === false) {
                throw new Exception('Düzenleme talebi oluşturulamadı: ' . $wpdb->last_error);
            }
        } catch (Exception $e) {
            error_log('Düzenleme talebi kaydedilirken hata: ' . $e->getMessage());
            throw $e;
        }
        
        // Host sayılarını güncelle - tüm günler için aynı değer
        if (isset($params['male_hosts']) || isset($params['female_hosts'])) {
            // Mevcut tarihleri al
            $existing_dates = $wpdb->get_results($wpdb->prepare(
                "SELECT date FROM $host_table WHERE job_id = %d ORDER BY STR_TO_DATE(date, '%d/%m/%Y')",
                $job_id
            ));
            
            if ($existing_dates) {
                foreach ($existing_dates as $date_record) {
                    $date = $date_record->date;
                    
                    // Host sayılarını güncelle
                    $wpdb->update(
                        $host_table,
                        array(
                            'male_hosts' => $male_hosts,
                            'female_hosts' => $female_hosts
                        ),
                        array('job_id' => $job_id, 'date' => $date)
                    );
                }
            } else {
                // Tarih kayıtları yoksa, başlangıç ve bitiş tarihleri arasındaki her gün için oluştur
                try {
                    // İşin başlangıç ve bitiş tarihlerini al
                    $start_date = $job->start_date;
                    $end_date = $job->end_date;
                    
                    if (isset($params['start_date'])) {
                        $start_date = sanitize_text_field($params['start_date']);
                        
                        // start_date format kontrol ve düzeltme
                        if ($start_date === '0000-00-00') {
                            error_log('Host kayıt: Geçersiz başlangıç tarihi (0000-00-00), bugünün tarihi kullanılıyor.');
                            $start_date = date('d/m/Y');
                        }
                        
                        if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $start_date)) {
                            $date_parts = explode('-', $start_date);
                            $start_date = $date_parts[2] . '/' . $date_parts[1] . '/' . $date_parts[0];
                        }
                        
                        if (!preg_match('/^\d{2}\/\d{2}\/\d{4}$/', $start_date)) {
                            error_log('Host kayıt: Geçersiz başlangıç tarihi formatı, bugünün tarihi kullanılıyor.');
                            $start_date = date('d/m/Y');
                        }
                    }
                    
                    if (isset($params['end_date'])) {
                        $end_date = sanitize_text_field($params['end_date']);
                        
                        // end_date format kontrol ve düzeltme
                        if ($end_date === '0000-00-00') {
                            error_log('Host kayıt: Geçersiz bitiş tarihi (0000-00-00), yarının tarihi kullanılıyor.');
                            $end_date = date('d/m/Y', strtotime('+1 day'));
                        }
                        
                        if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $end_date)) {
                            $date_parts = explode('-', $end_date);
                            $end_date = $date_parts[2] . '/' . $date_parts[1] . '/' . $date_parts[0];
                        }
                        
                        if (!preg_match('/^\d{2}\/\d{2}\/\d{4}$/', $end_date)) {
                            error_log('Host kayıt: Geçersiz bitiş tarihi formatı, yarının tarihi kullanılıyor.');
                            $end_date = date('d/m/Y', strtotime('+1 day'));
                        }
                    }
                    
                    // Tarihleri log'a yaz
                    error_log("Host kayıt: Tarih değerleri - Başlangıç=" . $start_date . ", Bitiş=" . $end_date);
                    
                    // Tarihlerin geçerli olup olmadığını kontrol et
                    if (preg_match('/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/([0-9]{4})$/', $start_date) &&
                        preg_match('/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/([0-9]{4})$/', $end_date)) {
                        
                        // Tarihleri parçalara ayır
                        $start_date_parts = explode('/', $start_date);
                        $end_date_parts = explode('/', $end_date);
                        
                        // GG/AA/YYYY formatındaki tarihi Date nesnesine çevir
                        $start_date_obj = new DateTime($start_date_parts[2] . '-' . $start_date_parts[1] . '-' . $start_date_parts[0]);
                        $end_date_obj = new DateTime($end_date_parts[2] . '-' . $end_date_parts[1] . '-' . $end_date_parts[0]);
                        
                        // Başlangıç ve bitiş tarihleri arasındaki her gün için kayıt oluştur
                        $interval = new DateInterval('P1D');
                        $date_range = new DatePeriod($start_date_obj, $interval, $end_date_obj->modify('+1 day'));
                        
                        foreach ($date_range as $date) {
                            $formatted_date = $date->format('d/m/Y');
                            
                            $wpdb->insert(
                                $host_table,
                                array(
                                    'job_id' => $job_id,
                                    'date' => $formatted_date,
                                    'male_hosts' => $male_hosts,
                                    'female_hosts' => $female_hosts
                                )
                            );
                        }
                    } else {
                        error_log('Geçersiz tarih formatı: Başlangıç: ' . $start_date . ', Bitiş: ' . $end_date);
                        error_log('Host sayıları için varsayılan tarihler kullanılıyor...');
                        
                        // Varsayılan tarih aralığı oluştur (bugün ve yarın)
                        $today = date('d/m/Y');
                        $tomorrow = date('d/m/Y', strtotime('+1 day'));
                        
                        // Bugün için kayıt
                        $wpdb->insert(
                            $host_table,
                            array(
                                'job_id' => $job_id,
                                'date' => $today,
                                'male_hosts' => $male_hosts,
                                'female_hosts' => $female_hosts
                            )
                        );
                        
                        // Yarın için kayıt
                        $wpdb->insert(
                            $host_table,
                            array(
                                'job_id' => $job_id,
                                'date' => $tomorrow,
                                'male_hosts' => $male_hosts,
                                'female_hosts' => $female_hosts
                            )
                        );
                    }
                } catch (Exception $e) {
                    error_log('Host sayıları güncelleme hatası: ' . $e->getMessage());
                }
            }
        }
        
        // Admin'e e-posta bildirimi gönder
        $admin_email = get_option('admin_email');
        $subject = 'Yeni İş Düzenleme Talebi';
        $user_info = get_userdata($current_user_id);
        $user_name = $user_info->display_name;
        
        $message = "Merhaba,\n\n";
        $message .= "{$user_name} tarafından #{$job_id} ID'li iş için bir düzenleme talebi gönderildi.\n\n";
        $message .= "Talebi incelemek için yönetim paneline gidebilirsiniz.\n";
        $message .= site_url('/wp-admin/admin.php?page=job_edit_requests');
        
        wp_mail($admin_email, $subject, $message);
        
        // Tüm işlemler başarılı ise commit
        $wpdb->query('COMMIT');
        
        return array(
            'success' => true,
            'message' => 'İş düzenleme talebi başarıyla gönderildi'
        );
    } catch (Exception $e) {
        // Hata olursa rollback
        $wpdb->query('ROLLBACK');
        
        error_log('İş düzenleme hatası: ' . $e->getMessage());
        
        return new WP_Error(
            'update_job_failed', 
            'İş düzenleme işlemi başarısız: ' . $e->getMessage(), 
            array('status' => 500)
        );
    }
}

// 4. İş Silme Talebi API
function delete_agency_job($request) {
    global $wpdb;
    $job_id = $request->get_param('id');
    $table_name = $wpdb->prefix . 'jobs';
    
    $current_user_id = get_current_user_id();
    
    error_log("İş silme talebi - İş ID: $job_id, Kullanıcı ID: $current_user_id");
    
    // İşin mevcut olduğunu ve bu kullanıcıya ait olduğunu kontrol et
    $job = $wpdb->get_row($wpdb->prepare(
        "SELECT * FROM $table_name WHERE id = %d AND partner_id = %d",
        $job_id, $current_user_id
    ));
    
    if (!$job) {
        error_log("İş silme hatası: İş bulunamadı veya kullanıcıya ait değil - İş ID: $job_id, Kullanıcı ID: $current_user_id");
        return new WP_Error('invalid_job', 'İş bulunamadı veya silme yetkiniz yok', array('status' => 403));
    }
    
    // Mevcut delete_request değerini logla
    error_log("Mevcut delete_request değeri: " . var_export($job->delete_request, true));
    
    // Silme talebini ayarla
    $update_result = $wpdb->update(
        $table_name,
        array('delete_request' => 1),
        array('id' => $job_id)
    );
    
    if ($update_result === false) {
        error_log("İş silme talebi güncelleme hatası: " . $wpdb->last_error);
        return new WP_Error(
            'update_job_failed', 
            'İş silme talebi güncellenemedi: ' . $wpdb->last_error, 
            array('status' => 500)
        );
    }
    
    error_log("İş silme talebi başarıyla ayarlandı - İş ID: $job_id");
    
    // Güncellenmiş veriyi logla
    $updated_job = $wpdb->get_row($wpdb->prepare(
        "SELECT * FROM $table_name WHERE id = %d",
        $job_id
    ));
    
    error_log("Güncellenmiş delete_request değeri: " . var_export($updated_job->delete_request, true));
    
    return array(
        'success' => true,
        'message' => 'Silme talebi gönderildi'
    );
}

// 5. Mesajları Getirme API
function get_agency_messages($request) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'messages';
    
    $current_user_id = get_current_user_id();
    
    // Kullanıcının mesajlarını al
    $messages = $wpdb->get_results($wpdb->prepare(
        "SELECT * FROM $table_name WHERE user_id = %d ORDER BY created_at DESC",
        $current_user_id
    ));
    
    return array(
        'messages' => $messages,
        'unread_count' => count(array_filter($messages, function($msg) { return $msg->is_read == 0; }))
    );
}

// 6. Mesaj Okundu İşaretleme API
function mark_message_as_read_api($request) {
    global $wpdb;
    $message_id = $request->get_param('id');
    $table_name = $wpdb->prefix . 'messages';
    
    $current_user_id = get_current_user_id();
    
    // Mesajın bu kullanıcıya ait olduğunu kontrol et
    $message = $wpdb->get_row($wpdb->prepare(
        "SELECT * FROM $table_name WHERE id = %d AND user_id = %d",
        $message_id, $current_user_id
    ));
    
    if (!$message) {
        return new WP_Error('invalid_message', 'Mesaj bulunamadı veya erişim yetkiniz yok', array('status' => 403));
    }
    
    // Mesajı okundu olarak işaretle
    $wpdb->update(
        $table_name,
        array('is_read' => 1),
        array('id' => $message_id)
    );
    
    return array(
        'success' => true,
        'message' => 'Mesaj okundu olarak işaretlendi'
    );
}

// 7. Kullanıcı Bilgilerini Getirme API
function get_agency_user_profile($request) {
    $current_user_id = get_current_user_id();
    $user = get_userdata($current_user_id);
    
    if (!$user) {
        return new WP_Error('invalid_user', 'Kullanıcı bulunamadı', array('status' => 404));
    }
    
    return array(
        'user_id' => $user->ID,
        'username' => $user->user_login,
        'email' => $user->user_email,
        'display_name' => $user->display_name,
        'first_name' => get_user_meta($current_user_id, 'first_name', true),
        'last_name' => get_user_meta($current_user_id, 'last_name', true),
        'agency' => get_user_meta($current_user_id, 'agency', true)
    );
}

// 8. Kullanıcı Bilgilerini Güncelleme API
function update_agency_user($request) {
    $params = $request->get_params();
    $current_user_id = get_current_user_id();
    
    // Adı güncelle
    if (isset($params['first_name'])) {
        update_user_meta($current_user_id, 'first_name', sanitize_text_field($params['first_name']));
    }
    
    // Soyadı güncelle
    if (isset($params['last_name'])) {
        update_user_meta($current_user_id, 'last_name', sanitize_text_field($params['last_name']));
    }
    
    // Display name güncelle
    if (isset($params['display_name'])) {
        wp_update_user(array(
            'ID' => $current_user_id,
            'display_name' => sanitize_text_field($params['display_name'])
        ));
    }
    
    // Şifreyi güncelle
    if (isset($params['password']) && !empty($params['password'])) {
        wp_update_user(array(
            'ID' => $current_user_id,
            'user_pass' => $params['password']
        ));
    }
    
    return array(
        'success' => true,
        'message' => 'Kullanıcı bilgileri güncellendi'
    );
}

// 9. Acenta ve Otel Bilgilerini Getirme API
function get_agency_options($request) {
    // Otel listesi
    $hotel_names = get_option('hotel_names', '');
    $hotels = explode(',', $hotel_names);
    
    // Konaklama seçenekleri
    $accommodation_options = get_option('accommodation_options', '');
    $accommodations = explode(',', $accommodation_options);
    
    // Erkek kıyafet seçenekleri
    $male_outfit_options = get_option('male_outfit_options', '');
    $male_outfits = explode(',', $male_outfit_options);
    
    // Kadın kıyafet seçenekleri
    $female_outfit_options = get_option('female_outfit_options', '');
    $female_outfits = explode(',', $female_outfit_options);
    
    return array(
        'hotels' => array_map('trim', $hotels),
        'accommodations' => array_map('trim', $accommodations),
        'male_outfits' => array_map('trim', $male_outfits),
        'female_outfits' => array_map('trim', $female_outfits)
    );
}